const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ExpenseDB',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || 'Chunmunsnt@512',
  {
    host: process.env.DB_HOST || 'expensedb.c56kwqkvtgel.us-east-1.rds.amazonaws.com',
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
