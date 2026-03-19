const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MockTest = sequelize.define('MockTest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cbtId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'cbts', key: 'id' },
  },
  testNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'mock_tests',
  timestamps: true,
});

module.exports = MockTest;
