const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAnswer = sequelize.define('UserAnswer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  attemptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'test_attempts', key: 'id' },
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'questions', key: 'id' },
  },
  selectedOption: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: true,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  isMarkedForReview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Time spent on this question in seconds',
  },
}, {
  tableName: 'user_answers',
  timestamps: false,
});

module.exports = UserAnswer;
