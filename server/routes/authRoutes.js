const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyRegisterOTP);
router.post('/login', authController.login);
router.post('/login-verify', authController.loginVerify);
router.get('/me', authMiddleware, authController.getMe);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

module.exports = router;
