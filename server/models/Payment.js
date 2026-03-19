const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
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
  razorpayOrderId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  razorpayPaymentId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10,
    comment: 'Amount in INR',
  },
  status: {
    type: DataTypes.ENUM('created', 'paid', 'failed'),
    defaultValue: 'created',
  },
}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;
