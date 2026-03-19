const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestAttempt = sequelize.define('TestAttempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  mockTestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'mock_tests', key: 'id' },
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalCorrect: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalIncorrect: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalSkipped: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Time taken in seconds',
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'test_attempts',
  timestamps: true,
});

module.exports = TestAttempt;
