const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING },
  status: { 
    type: DataTypes.ENUM('active', 'completed', 'cancelled'), 
    defaultValue: 'active' 
  }
});

module.exports = Event;