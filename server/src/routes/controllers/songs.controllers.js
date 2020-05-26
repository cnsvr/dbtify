const Joi = require('joi');
const db = require('../db/connection');

const songSchema = Joi.object().keys({
  title: Joi.string().min(1).max(255).required(),
});

// list all songs

const allSongs = (req, res, next) => {
  try {
    const query = `SELECT * FROM song`;
    db.query(query,(err,result) => {
      if (err) {
        res.status(422);
        next(new Error('Database Error'));
      } else {
        res.json({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

const songsOfArtist = (req, res, next) => {
  const { artist_name: name } = req.params;
  try {
    const query = `SELECT * FROM song WHERE artist_name='${name}'`;
    db.query(query,(err,result) => {
      if (err) {
        res.status(422);
        next(new Error('Database Error'));
      } else {
        res.json({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

const songsOfAlbum = (req, res, next) => {
  const { album_id: id } = req.params;
  try {
    const query = `SELECT * FROM song WHERE album_id=${id}`;
    db.query(query,(err,result) => {
      if (err) {
        res.status(422);
        next(new Error('Database Error'));
      } else {
        res.json({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

// add song
const addSong = (req, res, next) => {
  const { artist_name: name, album_id: id} = req.params;
  try {
    if ( req.user.user === name ) {
      const result = Joi.validate(req.body,songSchema);
      if ( result.error === null ) {
        const song = {
          ...req.body,
          album_id: id,
          artist_name: name,
        };
        const query = `INSERT INTO song (title,album_id,artist_name) VALUES (?)`;
        db.query(query,[Object.values(song)],(err,result) => {
          if (err) {
            console.log(err);
            res.status(422);
            next(new Error('Database Error'));
          } else {
            res.send({result});
          }
        });
      } else {
        res.status(422);
        throw new Error(result.error);
      }
    } else {
      throw new Error('Un-Authorized');
    }
  } catch (error) {
    next(error);
  }
};



// update song of artist in right album.

const updateSong = (req, res, next) => {
  // Unique ID
  const { artist_name: name, song_id : id } = req.params;
  try {
    // Only owner can change song.
    if ( req.user.user === name) {
      const result = Joi.validate(req.body,songSchema);
      if (result.error === null) {
        const query = `UPDATE song SET title = ? WHERE song_id=${id} AND artist_name='${name}'`;
        db.query(query,[req.body.title],(err,result) => {
          if (err) {
            res.status(422);
            next(new Error('Database Error'));
          } else {
            res.json({result});
          }
        });
      } else {
        res.status(422);
        throw new Error(result.error);
      }
    } else {
      throw new Error('Un-Authorized');
    }
  } catch (error) {
    next(error);
  }
};

const deleteSong = (req, res, next) => {
  const { artist_name: name, song_id: id } = req.params;
  try {
    if (req.user.user === name) {
      const query = `DELETE FROM song WHERE song_id=${id} AND artist_name='${name}'`;
      db.query(query, (err,result) => {
        if (err) {
          // console.log(err);
          res.status(422);
          next(new Error('Database Error'));
        } else {
          console.log("Number of records deleted: " + result.affectedRows);
          res.send({result});
        }
      });
    } else {
      throw new Error('Un-Authorized');
    }
  } catch (error) {
    next(error);
  }
};

// listener like the song.
const likeSong = (req, res, next) => {
  const { song_id : id} = req.params;
  try {
    // If listener liked a song , no need to like again.
    const checkLikedList = `SELECT * FROM liked_song WHERE song_id=${id} AND username='${req.user.user}'`;
    db.query(checkLikedList,(err,result) => {
      if (err) {
        // console.log(err);
        res.status(422);
        next(new Error(err.sqlMessage));
      } else {
        if (result.length == 0) {
          const query = `UPDATE song SET number_of_likes = number_of_likes + 1 WHERE song_id =${id}`;
          db.query(query,(err,result) => {
            if (err) {
                // console.log(err);
                res.status(422);
                next(new Error(err.sqlMessage));
              } else {
                console.log("Number of records changed: " + result.affectedRows + " in song");
                // If any listener likes a song, insert this listener and song into liked_songs.
                const likedSong = {
                  song_id: id,
                  username: req.user.user,
                }
                const liked_query = `INSERT INTO liked_song VALUES (?)`;
                db.query(liked_query,[Object.values(likedSong)],(err,result) => {
                  if (err) {
                    res.status(422);
                    next(new Error(err.sqlMessage));
                  } else {
                    console.log("Number of records changed: " + result.affectedRows + " in liked_song");
                    res.send({result});
                  }
                });
              }
            });
        } else {
          res.status(422);
          next(new Error('You can\'t like same song more than once.'));
        }
      }
    });
    // If any listener likes a song, insert this listener and song into liked_songs.
  } catch (error) {
    next(error);
  }
};


// get popular song of artist.

const popularSongOfArtist = (req, res, next) => {
  const { artist_name: name } = req.params;
  try {
    const query = `SELECT * FROM song WHERE artist_name='${name}' ORDER BY number_of_likes DESC`;
    db.query(query, (err, result) => {
      if (err) {
        res.status(422);
        next(new Error(err.sqlMessage));
      } else {
        res.send({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

// get songs of a specific genre.
const songsOfGenre = (req, res, next) => {
  const { genre : genre }  = req.params;
  try {
    const query = `SELECT song.* FROM song JOIN album ON song.album_id = album.album_id AND album.genre = '${genre}';`;
    db.query(query,(err,result) => {
      if (err) {
        res.status(422);
        next(new Error(err.sqlMessage));
      } else {
        res.send({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

const searchSong = (req, res, next) => {
  const { keyword: keyword } = req.params;
  console.log(req.params);
  try {
    const query = `SELECT * FROM song  WHERE title LIKE '%${keyword}%';`;
    db.query(query,(err,result) => {
      if (err) {
        res.status(422);
        next(new Error(err.sqlMessage));
      } else {
        res.send({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allSongs,
  songsOfArtist,
  songsOfAlbum,
  addSong,
  updateSong,
  deleteSong,
  likeSong,
  popularSongOfArtist,
  songsOfGenre,
  searchSong
}