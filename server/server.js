// Import required packages
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3001;
const rebuild = process.argv[2] === "--rebuild";

// Sync database
sequelize.sync({ force: rebuild }).then(async () => {
  console.log("yas queen");

  const tables = await sequelize.getQueryInterface().showAllTables();
  console.log("Tables in database:", tables);
});
