const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
require('dotenv').config();

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

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
