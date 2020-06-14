var mysql = require('mysql');

require('dotenv').config();

var connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
  database: process.env.DATABASE,
});

module.exports = connection;