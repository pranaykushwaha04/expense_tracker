const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'expensedb.c56kwqkvtgel.us-east-1.rds.amazonaws.com',
      port: process.env.DB_PORT || 3307,
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password',
    });

    const dbName = process.env.DB_NAME || 'ExpenseDB';

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists.`);

    await connection.end();

    const sequelize = require('./config/database');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
