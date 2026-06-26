const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Revenue = sequelize.define(
  "Revenue",
  {
    revenue_id: {
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
    tableName: "Revenue",
    timestamps: false,
  }
);

module.exports = Revenue;