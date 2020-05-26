
const mysql = require('mysql');

const con = mysql.createConnection({
  server:'127.0.0.1',
  user: 'root',
  password: 'root123456',
  insecureAuth : true,
  port:3306,
});


const queries = [
  "USE dbtify",
  "CREATE TABLE listener (username VARCHAR(255) UNIQUE, email VARCHAR(255) UNIQUE,password VARCHAR(255) NOT NULL,PRIMARY KEY (username,email))",
  "CREATE TABLE artist (artist_name VARCHAR(255) UNIQUE, artist_surname VARCHAR(255) UNIQUE, password VARCHAR(255) NOT NULL ,PRIMARY KEY(artist_name,artist_surname))",
  "CREATE TABLE album (album_id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, genre VARCHAR(255) NOT NULL, artist_name VARCHAR(255) , number_of_likes INT DEFAULT 0, FOREIGN KEY (artist_name) REFERENCES artist (artist_name))",
  "CREATE TABLE song (song_id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, album_id INT, artist_name VARCHAR(255) , number_of_likes INT DEFAULT 0, FOREIGN KEY (artist_name) REFERENCES artist (artist_name),FOREIGN KEY (album_id) REFERENCES album (album_id))",
  "CREATE TABLE liked_song (song_id INT, username VARCHAR(255), FOREIGN KEY (song_id) REFERENCES song (song_id), FOREIGN KEY (username) REFERENCES listener (username))",
];


// Initialize Database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE dbtify",(err,results) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      console.log(results);
    }
  });
  for (q in queries) {
    con.query(queries[q], (err,results) => {
      if (err) {
        console.log(err.sqlMessage);
      } else {
        console.log(queries[q]);
      }
    });
  }
  con.end();
});


