const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mockTestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'mock_tests', key: 'id' },
  },
  questionNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  optionA: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  optionB: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  optionC: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  optionD: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  correctOption: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false,
  },
  solutionText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  topic: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium',
  },
}, {
  tableName: 'questions',
  timestamps: false,
});

module.exports = Question;
