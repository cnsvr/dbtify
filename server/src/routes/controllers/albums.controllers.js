const Joi = require('joi');
const db = require('../db/connection');

const albumSchema = Joi.object().keys({
  title: Joi.string().min(1).max(255).required(),
  genre:Joi.string().min(1).max(255).required(),
});


// post new album 

const addAlbum = (req, res, next) => {
  const { artist_name: name } = req.params;
  const result = Joi.validate(req.body,albumSchema);
  try {
    const album = {
      ...req.body,
      artist_name: name,
    }
    if (result.error === null) {
      const query = `INSERT INTO album (genre,title,artist_name) VALUES (?)`;
      db.query(query,[Object.values(album)],(err,result) => {
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
    
  } catch (error) {
    next(error);
  }
};

// get all album list

const allAlbums = (req, res, next) => {
  try {
    const query = `SELECT * FROM album`;
    db.query(query, (err,result) => {
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

const artistAlbum = (req, res, next) => {
  const { artist_name: name  } = req.params;
  try {
    const query = `SELECT * FROM album WHERE artist_name='${name}'`;
    db.query(query,(err,result) => {
      if (err) {
        console.log(err);
        res.status(422);
        next(new Error('Database Error'));
      } else {
        res.send({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateOne = (req, res, next) => {
  const { artist_name: name, id:album_id } = req.params;
  try {
    const result = Joi.validate(req.body,albumSchema);
    if (result.error === null){
      if (req.user.user === name) {
        const query = `UPDATE album SET title = ?, genre = ? WHERE album_id=${album_id} AND artist_name='${name}'`;
        // TODO: If update the album ,  number_of_likes ?????

        db.query(query,[req.body.title,req.body.genre],(err,result) => {
          if (err) {
            console.log(err);
            res.status(422);
            next(new Error('Database Error'));
          } else {
            console.log(result.affectedRows + " record(s) updated");
            res.send({result});
          }
        });
      } else {
        res.status(422);
        next(new Error('Un-Authorized'));
      }
    } else {
      res.status(422);
      throw new Error(result.error);
    }
  } catch (error) {
    next(error);
  }

};

const deleteAlbum = (req, res, next) => {
  const { artist_name:name, id:album_id } = req.params;
  // console.log(album_id,req.user.user);
  try {
    if (req.user.user === name ){
      const query = `DELETE FROM album WHERE album_id=${album_id} AND artist_name='${name}'`;
      db.query(query,(err,result) => {
        if (err) {
          // console.log(err);
          res.status(422);
          next(new Error(err.sqlMessage));
        } else {
          console.log("Number of records deleted: " + result.affectedRows);
          res.send({result});
        }
      });
    } else {  
      res.status(422);
      throw new Error(result.error);
    }
  } catch (error) {
    next(error);
  }
};

const likeAlbum = (req, res, next) => {
  const { album_id : id } = req.params;
  try {
    const query = `UPDATE album SET number_of_likes = number_of_likes + 1 WHERE album_id =${id}`;
    db.query(query,(err,result) => {
      if (err) {
          // console.log(err);
          res.status(422);
          next(new Error(err.sqlMessage));
        } else {
          console.log("Number of records changed: " + result.affectedRows);
          // res.send({result});
        }
        // If user like album , all songs of album go to liked_song
        const getAllSong = `SELECT song_id FROM song where album_id =${id}`;
        values = [];
        db.query(getAllSong,(err,results) => {
          if (err) {
            // console.log(err);
            res.status(422);
            next(new Error('Database Error'));
          } else {
            results.forEach(result => {
              values.push([
                Number(result.song_id),
                req.user.user
              ]);
            });
          }
          console.log(values);
          const setLikedSongs = `INSERT INTO liked_song (song_id,username) VALUES ?`;
          db.query(setLikedSongs,[values], (err,result) => {
            if (err) {
              // console.log(err);
              res.status(422);
              next(new Error(err));
            } else {
              res.send({result});
            }
          });
        });
      });
    // 
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAlbum,
  allAlbums,
  updateOne,
  deleteAlbum,
  artistAlbum,
  likeAlbum
}