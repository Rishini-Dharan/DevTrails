const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Policy = sequelize.define('Policy', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  plan: {
    type: DataTypes.ENUM('basic', 'standard', 'premium'),
    allowNull: false,
  },
  premium: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  coverageLimit: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  coveragePercent: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  weekStart: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  weekEnd: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    defaultValue: 'active',
  },
  riskFactor: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0,
  },
  riskExplanation: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  disruptionsCovered: {
    type: DataTypes.STRING,
    defaultValue: 'weather',
  },
});

module.exports = Policy;
