const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },

    signup_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    role: {
      type: DataTypes.ENUM("admin", "user", "event_organizer"),
      defaultValue: "user",
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;