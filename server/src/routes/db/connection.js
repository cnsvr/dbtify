var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'127.0.0.1',
  user: 'root',
  password: 'root123456',
  port:3306,
  database: 'dbtify',
});

module.exports = connection;