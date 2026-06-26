const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("community_app", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;