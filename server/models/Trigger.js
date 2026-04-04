const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Trigger = sequelize.define('Trigger', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('TRG-RAIN', 'TRG-FLOOD', 'TRG-HEAT', 'TRG-AQI', 'TRG-CURFEW', 'TRG-STRIKE', 'TRG-PLATFORM'),
    allowNull: false,
  },
  zone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parameter: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  threshold: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  actualValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  durationHours: {
    type: DataTypes.FLOAT,
    defaultValue: 2,
  },
  status: {
    type: DataTypes.ENUM('fired', 'resolved', 'expired'),
    defaultValue: 'fired',
  },
  affectedPolicies: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPayouts: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  firedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dataSource: {
    type: DataTypes.STRING,
    defaultValue: 'OpenWeatherMap',
  },
});

module.exports = Trigger;
