require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Write your DB Password Here
});




module.exports = connection;