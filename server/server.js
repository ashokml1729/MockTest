const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
require('dotenv').config();

// Import passport config
require('./config/passport');

// Import database & models
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const testRoutes = require('./routes/testRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ──
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
