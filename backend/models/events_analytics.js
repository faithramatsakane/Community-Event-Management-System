const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EventsAnalytics = sequelize.define(
  "EventsAnalytics",
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
    tableName: "EventsAnalytics",
    timestamps: false,
  }
);

module.exports = EventsAnalytics;