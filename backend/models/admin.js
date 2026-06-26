const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const admin = sequelize.define(
  "Admin",
  {
    admin_id: {
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
    tableName: "Admin",
    timestamps: false,
  }
);

module.exports = admin;