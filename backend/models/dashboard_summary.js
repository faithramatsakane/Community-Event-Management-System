const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const dashboard_summary = sequelize.define(
  "DashboardSummary",
  {
    event_id: {
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
    tableName: "Events",
    timestamps: false,
  }
);

module.exports = Events;
//to figure it out because it must include users and organisers