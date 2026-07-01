const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  // Personal Info
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  // Security
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  // Roles & Permissions
  role: { 
    type: DataTypes.ENUM('user', 'organizer', 'admin'), 
    defaultValue: 'user' 
  },
  isApproved: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
});

module.exports = User;