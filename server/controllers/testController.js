const { MockTest, CBT, Question, TestAttempt, UserAnswer, Payment, User, Exam } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/tests/:testId/start — get all questions (auth required)
exports.startTest = async (req, res) => {
  try {
    const test = await MockTest.findByPk(req.params.testId, {
      include: [{
        model: CBT,
        as: 'cbt',
        include: [{ model: Exam, as: 'exam', attributes: ['name', 'category', 'slug'] }],
      }],
    });

    if (!test) return res.status(404).json({ error: 'Test not found' });

    // Check payment for paid tests
    if (!test.isFree) {
      const payment = await Payment.findOne({
        where: { userId: req.user.id, mockTestId: test.id, status: 'paid' },
      });
      if (!payment) {
        return res.status(403).json({ error: 'Payment required for this test', requiresPayment: true });
      }
    }

    const questions = await Question.findAll({
      where: { mockTestId: test.id },
      attributes: ['id', 'questionNumber', 'questionText', 'optionA', 'optionB', 'optionC', 'optionD', 'topic'],
      order: [['questionNumber', 'ASC']],
    });

    res.json({
      test: {
        id: test.id,
        title: test.title,
        duration: test.cbt.duration,
        totalQuestions: test.cbt.totalQuestions,
        totalMarks: test.cbt.totalMarks,
        negativeMarking: test.cbt.negativeMarking,
        subjects: test.cbt.subjects,
        exam: test.cbt.exam,
      },
      questions,
    });
  } catch (error) {
    console.error('Start test error:', error);
    res.status(500).json({ error: 'Failed to start test' });
  }
};

// POST /api/tests/:testId/submit — submit answers and calculate score
exports.submitTest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { answers, timeTaken } = req.body;
    const testId = req.params.testId;

    const test = await MockTest.findByPk(testId, {
      include: [{ model: CBT, as: 'cbt' }],
    });
    if (!test) return res.status(404).json({ error: 'Test not found' });

    const questions = await Question.findAll({
      where: { mockTestId: testId },
      order: [['questionNumber', 'ASC']],
    });

    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalSkipped = 0;
    let score = 0;

    const marksPerQuestion = test.cbt.totalMarks / test.cbt.totalQuestions;

    // Create attempt
    const attempt = await TestAttempt.create({
      userId: req.user.id,
      mockTestId: testId,
      timeTaken: timeTaken || 0,
    }, { transaction });

    // Process answers
    const userAnswers = [];
    for (const question of questions) {
      const userAnswer = answers ? answers[question.id] : null;
      const selectedOption = userAnswer?.selectedOption || null;
      const isMarkedForReview = userAnswer?.isMarkedForReview || false;
      const timeSpent = userAnswer?.timeSpent || 0;

      let isCorrect = null;
      if (selectedOption) {
        isCorrect = selectedOption === question.correctOption;
        if (isCorrect) {
          totalCorrect++;
          score += marksPerQuestion;
        } else {
          totalIncorrect++;
          score -= test.cbt.negativeMarking;
        }
      } else {
        totalSkipped++;
      }

      userAnswers.push({
        attemptId: attempt.id,
        questionId: question.id,
        selectedOption,
        isCorrect,
        isMarkedForReview,
        timeSpent,
      });
    }

    await UserAnswer.bulkCreate(userAnswers, { transaction });

    // Update attempt with scores
    attempt.score = Math.max(0, parseFloat(score.toFixed(2)));
    attempt.totalCorrect = totalCorrect;
    attempt.totalIncorrect = totalIncorrect;
    attempt.totalSkipped = totalSkipped;

    // Calculate rank
    const betterAttempts = await TestAttempt.count({
      where: { mockTestId: testId, score: { [Op.gt]: attempt.score } },
      transaction,
    });
    attempt.rank = betterAttempts + 1;

    await attempt.save({ transaction });
    await transaction.commit();

    res.json({
      message: 'Test submitted successfully',
      result: {
        attemptId: attempt.id,
        score: attempt.score,
        totalCorrect,
        totalIncorrect,
        totalSkipped,
        totalQuestions: questions.length,
        totalMarks: test.cbt.totalMarks,
        timeTaken: attempt.timeTaken,
        rank: attempt.rank,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Submit test error:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
};

// GET /api/tests/:testId/results/:attemptId — detailed results
exports.getResults = async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      where: { id: req.params.attemptId, userId: req.user.id },
      include: [{
        model: MockTest,
        as: 'mockTest',
        include: [{
          model: CBT,
          as: 'cbt',
          include: [{ model: Exam, as: 'exam', attributes: ['name', 'slug', 'category'] }],
        }],
      }],
    });

    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    const totalAttempts = await TestAttempt.count({
      where: { mockTestId: attempt.mockTestId },
    });

    // Flatten CBT data onto mockTest for frontend compatibility
    const json = attempt.toJSON();
    if (json.mockTest?.cbt) {
      json.mockTest.totalMarks = json.mockTest.cbt.totalMarks;
      json.mockTest.totalQuestions = json.mockTest.cbt.totalQuestions;
    }

    res.json({
      result: {
        ...json,
        totalAttempts,
      },
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};

// GET /api/tests/:testId/solutions/:attemptId — solutions with user answers
exports.getSolutions = async (req, res) => {
  try {
    const attempt = await TestAttempt.findOne({
      where: { id: req.params.attemptId, userId: req.user.id },
    });

    if (!attempt) return res.status(404).json({ error: 'Attempt not found' });

    const questions = await Question.findAll({
      where: { mockTestId: req.params.testId },
      order: [['questionNumber', 'ASC']],
    });

    const userAnswers = await UserAnswer.findAll({
      where: { attemptId: attempt.id },
    });

    const answerMap = {};
    userAnswers.forEach(a => { answerMap[a.questionId] = a; });

    const solutions = questions.map(q => ({
      ...q.toJSON(),
      userAnswer: answerMap[q.id] ? answerMap[q.id].selectedOption : null,
      isCorrect: answerMap[q.id] ? answerMap[q.id].isCorrect : null,
      isMarkedForReview: answerMap[q.id] ? answerMap[q.id].isMarkedForReview : false,
    }));

    res.json({ solutions, attempt });
  } catch (error) {
    console.error('Get solutions error:', error);
    res.status(500).json({ error: 'Failed to fetch solutions' });
  }
};

// GET /api/tests/:testId/leaderboard — top scores
exports.getLeaderboard = async (req, res) => {
  try {
    const attempts = await TestAttempt.findAll({
      where: { mockTestId: req.params.testId },
      order: [['score', 'DESC'], ['timeTaken', 'ASC']],
      limit: 50,
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
    });

    const leaderboard = attempts.map((a, idx) => ({
      rank: idx + 1,
      username: a.user.username,
      avatar: a.user.avatar,
      score: a.score,
      timeTaken: a.timeTaken,
      totalCorrect: a.totalCorrect,
      totalIncorrect: a.totalIncorrect,
      isCurrentUser: req.user ? a.userId === req.user.id : false,
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
