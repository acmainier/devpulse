// Import Sequelize connection
const sequelize = require("../config/connection");

// import all models
const Category = require("./category");

module.exports = {
  sequelize,
  Category,
};
