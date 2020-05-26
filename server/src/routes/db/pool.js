'use strict';

const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 2,
  host: '127.0.0.1',
  user: 'root',
  password: 'root123456',
  port:3306,
  database: 'dbtify',
  charset: 'utf8mb4',
  debug : false,
});

var DB = (function () {

  async function _query(query, params, callback) {
      await pool.getConnection(async function (err, connection) {
          if (err) {
              connection.release();
              callback(null, err);
              throw err;
          }

          await connection.query(query, params, function (err, rows) {
              connection.release();
              if (!err) {
                  callback(rows);
              }
              else {
                  callback(null, err);
              }

          });

          await connection.on('error', function (err) {
              connection.release();
              callback(null, err);
              throw err;
          });
      });
  };

  return {
      query: _query
  };
})();

async function test () {

  await DB.query('SELECT 1 + 1',null,(data,err)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
  await DB.query('SELECT 1 + 2',null,(data,err)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
  console.log('asd');
  await DB.query('SELECT 1 + 2',null,(data,err)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
}

test();



module.exports = DB;

