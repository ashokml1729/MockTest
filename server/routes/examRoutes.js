const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', examController.getExams);
router.get('/:slug', optionalAuth, examController.getExamBySlug);
router.get('/:slug/tests/:testId', examController.getTestInfo);

module.exports = router;
