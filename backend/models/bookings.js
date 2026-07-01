const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const bookings = sequelize.define('Booking', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'confirmed' 
  },
  bookingsDate: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
});

module.exports = bookings;