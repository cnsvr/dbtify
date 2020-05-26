const db = require('../db/connection');

// get listeners's liked songs.

const likedSongsOfListener = (req, res, next) => {
  const { username: name } = req.params;
  try {
    const query = `SELECT * FROM liked_song WHERE username='${name}'`;
    db.query(query, (err,result) => {
      if (err) {
        // console.log(err);
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
 

module.exports = {
  likedSongsOfListener
}