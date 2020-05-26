const db = require('../db/connection');

const allArtist = (req, res, next) => {
  try {
    const query = `SELECT artist_name,artist_surname FROM artist`;
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

module.exports = {
  allArtist
}