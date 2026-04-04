const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gigPlatform: {
    type: DataTypes.ENUM('zomato', 'swiggy'),
    allowNull: true,
  },
  gigId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weeklyEarnings: {
    type: DataTypes.INTEGER,
    defaultValue: 4500,
  },
  trustScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0.5,
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
  onboarded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
