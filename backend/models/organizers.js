const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Organizers = sequelize.define(
  "Organizers",
  {
    organiser_id: {
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
    tableName: "Organizers",
    timestamps: false,
  }
);

module.exports = Organizers;