const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateOTP, storeOTP, verifyOTP, sendOTPEmail } = require('../utils/otp');
require('dotenv').config();

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ error: 'Email already registered. Please login.' });
    }

    if (username) {
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken.' });
      }
    }

    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp);

    // Create unverified user if not exists
    if (!existingUser) {
      await User.create({
        email,
        username: username || email.split('@')[0] + '_' + Date.now().toString().slice(-4),
        isVerified: false,
      });
    }

    res.json({ message: 'OTP sent to your email', email });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// POST /api/auth/verify-otp
exports.verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isVerified = true;
    await user.save();

    const token = generateToken(user.id);
    res.json({
      message: 'Registration successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'No account with this email. Please register first.' });
    if (!user.isVerified) return res.status(400).json({ error: 'Account not verified. Please register again.' });

    const otp = generateOTP();
    storeOTP(email, otp);
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to your email', email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// POST /api/auth/login-verify
exports.loginVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    if (!verifyOTP(email, otp)) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = generateToken(user.id);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Login verify error:', error);
    res.status(500).json({ error: 'Login verification failed' });
  }
};

// GET /api/auth/google — redirect handled by Passport
// GET /api/auth/google/callback
exports.googleCallback = (req, res) => {
  const token = generateToken(req.user.id);
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user info' });
  }
};
