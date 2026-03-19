const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  authProvider: {
    type: DataTypes.ENUM('local', 'google'),
    defaultValue: 'local',
  },
  googleId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
