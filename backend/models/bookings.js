const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const bookings = sequelize.define(
  "Bookings",
  {
    booking_id: {
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
    tableName: "Bookings",
    timestamps: false,
  }
);

module.exports = bookings;