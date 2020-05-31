
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

const triggers = [
  'create trigger deleteAllSong before delete on `album`for each row begin delete from `song` where song.album_id = old.album_id; end;',
  'create trigger likeAllSong after update on `album` for each row begin if new.number_of_likes > old.number_of_likes then update `song` set number_of_likes = number_of_likes + 1 where song.album_id = new.album_id; end if; end;',
  'create trigger deleteLikedSong before delete on `song` for each row begin delete from `liked_song` where liked_song.song_id = old.song_id; end;',
];

const procedure = 'CREATE PROCEDURE `getCoArtist` (IN artistname nvarchar(255), IN artistsurname nvarchar(255)) begin select * from `song` where title in (select title from `song` where artist_name = artistname) and artist_name not in(artistname); end;';


// Initialize Database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE dbtify",(err,results) => {
    if (err) {
      console.log(err.sqlMessage);
    } else {
      console.log('Database is created successfully');
    }
  });
  // Create tables of database
  for (q in queries) {
    con.query(queries[q], (err,results) => {
      if (err) {
        console.log(err.sqlMessage);
      } else {
        console.log('Tables are created successfully');
      }
    });
  }
  // Create triggers
  for (let index = 0; index < triggers.length; index++) {
    con.query(triggers[index],(err,results,fields) => {
      if (err) {
        // console.log(err);
        console.log(err.sqlMessage);
      } else {
        console.log('Trigger is created successfully');
      }
    });
  }
  // Create procedures
  con.query(procedure,(err,results) => {
    if (err) {
      // console.log(err);
      console.log(err.sqlMessage);
    } else {
      console.log('Procedure is created successfully');
    }
  });
  con.end();
});


