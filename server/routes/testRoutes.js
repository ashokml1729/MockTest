const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

router.get('/:testId/start', authMiddleware, testController.startTest);
router.post('/:testId/submit', authMiddleware, testController.submitTest);
router.get('/:testId/results/:attemptId', authMiddleware, testController.getResults);
router.get('/:testId/solutions/:attemptId', authMiddleware, testController.getSolutions);
router.get('/:testId/leaderboard', optionalAuth, testController.getLeaderboard);

module.exports = router;
