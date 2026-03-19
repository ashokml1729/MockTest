const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CBT = sequelize.define('CBT', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'exams', key: 'id' },
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalMarks: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
    comment: 'Duration in minutes',
  },
  negativeMarking: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.25,
  },
  subjects: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Array of {name, questions, marks}',
  },
}, {
  tableName: 'cbts',
  timestamps: true,
});

module.exports = CBT;
