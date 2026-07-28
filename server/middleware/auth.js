const { Sequelize } = require("sequelize");
require("dotenv").config(); // loads variables from .env into process.env

// Creates the connection to our MySQL database.
// Credentials are read from environment variables, never hardcoded,
// so real passwords never end up in source control.
const sequelize = new Sequelize(
  process.env.DB_NAME, // database name (e.g. "devpulse")
  process.env.DB_USER, // MySQL username
  process.env.DB_PASSWORD, // MySQL password
  {
    host: process.env.DB_HOST, // where MySQL is running (e.g. "localhost")
    dialect: "mysql", // tells Sequelize which SQL engine to speak
  },
);

module.exports = sequelize;
