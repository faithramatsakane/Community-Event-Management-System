const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Events = sequelize.define(
  "Events",
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