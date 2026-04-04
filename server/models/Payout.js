const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Payout = sequelize.define('Payout', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  policyId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  triggerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  estimatedDailyIncome: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  disruptionHours: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  coveragePercent: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fraudScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  fraudTier: {
    type: DataTypes.ENUM('green', 'amber', 'red'),
    defaultValue: 'green',
  },
  fraudSignals: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('approved', 'pending', 'rejected', 'paid'),
    defaultValue: 'approved',
  },
  upiId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Phase 3: Payment gateway fields
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'upi',
  },
  paymentGateway: {
    type: DataTypes.STRING,
    defaultValue: 'razorpay_test',
  },
  upiRef: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Payout;
