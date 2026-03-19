const { TestAttempt, MockTest, CBT, Exam, UserAnswer, Question } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/user/history — all past test attempts
exports.getHistory = async (req, res) => {
  try {
    const attempts = await TestAttempt.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: MockTest,
        as: 'mockTest',
        attributes: ['id', 'title', 'isFree'],
        include: [{
          model: CBT,
          as: 'cbt',
          attributes: ['name', 'totalQuestions', 'totalMarks'],
          include: [{
            model: Exam,
            as: 'exam',
            attributes: ['name', 'slug', 'category', 'icon'],
          }],
        }],
      }],
    });

    // Flatten the response so the frontend can use attempt.mockTest.totalMarks etc.
    const history = attempts.map(a => {
      const json = a.toJSON();
      return {
        ...json,
        mockTest: {
          ...json.mockTest,
          totalQuestions: json.mockTest?.cbt?.totalQuestions,
          totalMarks: json.mockTest?.cbt?.totalMarks,
          exam: json.mockTest?.cbt?.exam,
        },
      };
    });

    res.json({ history });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// GET /api/user/analytics/:examSlug — performance analytics for an exam
exports.getAnalytics = async (req, res) => {
  try {
    const exam = await Exam.findOne({ where: { slug: req.params.examSlug } });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // Find CBTs for this exam, then mock tests under those CBTs
    const cbts = await CBT.findAll({
      where: { examId: exam.id },
      attributes: ['id'],
    });
    const cbtIds = cbts.map(c => c.id);

    const mockTests = await MockTest.findAll({
      where: { cbtId: { [Op.in]: cbtIds } },
      attributes: ['id'],
    });
    const testIds = mockTests.map(t => t.id);

    const attempts = await TestAttempt.findAll({
      where: {
        userId: req.user.id,
        mockTestId: { [Op.in]: testIds },
      },
      order: [['createdAt', 'ASC']],
      include: [{
        model: MockTest,
        as: 'mockTest',
        attributes: ['title'],
        include: [{
          model: CBT,
          as: 'cbt',
          attributes: ['totalMarks'],
        }],
      }],
    });

    // Topic-wise performance
    const topicPerformance = {};
    for (const attempt of attempts) {
      const answers = await UserAnswer.findAll({
        where: { attemptId: attempt.id },
        include: [{
          model: Question,
          as: 'question',
          attributes: ['topic'],
        }],
      });

      for (const answer of answers) {
        const topic = answer.question.topic;
        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { correct: 0, incorrect: 0, skipped: 0, total: 0 };
        }
        topicPerformance[topic].total++;
        if (answer.selectedOption === null) {
          topicPerformance[topic].skipped++;
        } else if (answer.isCorrect) {
          topicPerformance[topic].correct++;
        } else {
          topicPerformance[topic].incorrect++;
        }
      }
    }

    res.json({
      exam: { name: exam.name, slug: exam.slug, category: exam.category },
      totalAttempts: attempts.length,
      attempts: attempts.map(a => ({
        id: a.id,
        testTitle: a.mockTest.title,
        score: a.score,
        totalMarks: a.mockTest.cbt?.totalMarks,
        totalCorrect: a.totalCorrect,
        totalIncorrect: a.totalIncorrect,
        totalSkipped: a.totalSkipped,
        timeTaken: a.timeTaken,
        date: a.createdAt,
      })),
      topicPerformance,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

// GET /api/user/profile
exports.getProfile = async (req, res) => {
  try {
    const totalAttempts = await TestAttempt.count({ where: { userId: req.user.id } });
    const avgScore = await TestAttempt.findOne({
      where: { userId: req.user.id },
      attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgScore']],
      raw: true,
    });

    res.json({
      profile: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        authProvider: req.user.authProvider,
        createdAt: req.user.createdAt,
        totalAttempts,
        avgScore: avgScore.avgScore ? parseFloat(avgScore.avgScore).toFixed(2) : 0,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// PUT /api/user/profile
exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    if (username) {
      const existing = await require('../models').User.findOne({ where: { username, id: { [Op.ne]: req.user.id } } });
      if (existing) return res.status(400).json({ error: 'Username already taken' });
      req.user.username = username;
    }
    await req.user.save();

    res.json({
      message: 'Profile updated',
      user: { id: req.user.id, username: req.user.username, email: req.user.email, avatar: req.user.avatar },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
