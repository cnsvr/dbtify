'use strict';

const mysql = require('mysql');


const con = mysql.createConnection({
  server:'127.0.0.1',
  user: 'root',
  password: 'root123456',
  insecureAuth : true,
  database:'dbtify',
  port:3306,
});

con.connect(err=>{
  if (err) {
    // res.status(HttpStatus.BAD_GATEWAY);
    // next(new Errors.BadRequest(err.sqlMessage));
    console.log(err.sqlMessage);
  }
});

const triggers = [
  'create trigger deleteAllSong before delete on `album`for each row begin delete from `song` where song.album_id = old.album_id; end;',
  'create trigger likeAllSong after update on `album` for each row begin if new.number_of_likes > old.number_of_likes then update `song` set number_of_likes = number_of_likes + 1 where song.album_id = new.album_id; end if; end;',
  'create trigger deleteLikedSong before delete on `song` for each row begin delete from `liked_song` where liked_song.song_id = old.song_id; end;',
];

// const procedure = 'CREATE PROCEDURE `getCoArtist` (IN artistname nvarchar(255), IN artistsurname nvarchar(255)) begin select * from `song` where title in (select title from `song` where artist_name = artistname) and artist_name not in(artistname); end;';
const test = `SELECT song_id from song where album_id =12`;

con.query(test,(err,results) => {
  if (err) {
    // console.log(err);
    console.log(err);
  } else {
    console.log(results[0].song_id);
  }
});



module.exports = con;

