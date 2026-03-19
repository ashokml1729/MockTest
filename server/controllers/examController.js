const { Exam, CBT, MockTest, TestAttempt } = require('../models');

// GET /api/exams — all exams grouped by category
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [{ model: CBT, as: 'cbts', attributes: ['id'] }],
      order: [['category', 'ASC'], ['name', 'ASC']],
    });

    const grouped = {
      SSC: exams.filter(e => e.category === 'SSC').map(e => ({ ...e.toJSON(), totalTests: e.cbts.length })),
      Railway: exams.filter(e => e.category === 'Railway').map(e => ({ ...e.toJSON(), totalTests: e.cbts.length })),
      Banking: exams.filter(e => e.category === 'Banking').map(e => ({ ...e.toJSON(), totalTests: e.cbts.length })),
    };

    res.json({ exams: grouped });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};

// GET /api/exams/:slug — exam details with CBTs and mock tests
exports.getExamBySlug = async (req, res) => {
  try {
    const exam = await Exam.findOne({
      where: { slug: req.params.slug },
      include: [{
        model: CBT,
        as: 'cbts',
        include: [{
          model: MockTest,
          as: 'mockTests',
          attributes: ['id', 'testNumber', 'title', 'isFree'],
          order: [['testNumber', 'ASC']],
        }],
      }],
    });

    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // If user is logged in, attach attempt info
    let attemptedTestIds = [];
    if (req.user) {
      const attempts = await TestAttempt.findAll({
        where: { userId: req.user.id },
        attributes: ['mockTestId'],
      });
      attemptedTestIds = attempts.map(a => a.mockTestId);
    }

    const cbts = exam.cbts.map(cbt => ({
      ...cbt.toJSON(),
      mockTests: cbt.mockTests
        .sort((a, b) => a.testNumber - b.testNumber)
        .map(t => ({
          ...t.toJSON(),
          duration: cbt.duration,
          totalQuestions: cbt.totalQuestions,
          totalMarks: cbt.totalMarks,
          negativeMarking: cbt.negativeMarking,
          isAttempted: attemptedTestIds.includes(t.id),
        })),
    }));

    res.json({ exam: { ...exam.toJSON(), cbts } });
  } catch (error) {
    console.error('Get exam by slug error:', error);
    res.status(500).json({ error: 'Failed to fetch exam details' });
  }
};

// GET /api/exams/:slug/tests/:testId — mock test info (no questions)
exports.getTestInfo = async (req, res) => {
  try {
    const test = await MockTest.findByPk(req.params.testId, {
      include: [{
        model: CBT,
        as: 'cbt',
        include: [{ model: Exam, as: 'exam', attributes: ['name', 'category', 'slug'] }],
      }],
    });

    if (!test) return res.status(404).json({ error: 'Test not found' });

    res.json({ test });
  } catch (error) {
    console.error('Get test info error:', error);
    res.status(500).json({ error: 'Failed to fetch test info' });
  }
};
