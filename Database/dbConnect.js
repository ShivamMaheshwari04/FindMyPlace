const mysql = require("mysql");

const connection = mysql.createConnection({
    host : process.env.host ||'localhost',
    database : process.env.database ||'findmyplace',
    user : process.env.user || 'root',
    password : 'Shivam@123', // Write your DB Password Here
});



module.exports = connection;