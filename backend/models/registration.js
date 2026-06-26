const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const registration = sequelize.define(
  "Registration",
  {
    registration_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },


  },
  {
    tableName: "Registration",
    timestamps: false,
  }
);

module.exports = registration;