require("dotenv").config();

const Sequelize = require("sequelize");

if (process.env.DB_PASSWORD === "ChangeMe!") {
  console.error("Please update the .env file with your database password.");
  process.exit(1);
}

const sequelizeOptions = {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
};

if (process.env.DB_SSL === "true") {
  sequelizeOptions.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      sequelizeOptions,
    );

module.exports = sequelize;
