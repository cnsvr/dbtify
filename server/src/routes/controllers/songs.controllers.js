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
    const query = `UPDATE song SET number_of_likes = number_of_likes + 1 WHERE song_id =${id}`;
    db.query(query,(err,result) => {
      if (err) {
          // console.log(err);
          res.status(422);
          next(new Error('Database Error'));
        } else {
          console.log("Number of records changed: " + result.affectedRows);
          res.send({result});
        }
      });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  allSongs,
  songsOfArtist,
  songsOfAlbum,
  addSong,
  updateSong,
  deleteSong,
  likeSong
}