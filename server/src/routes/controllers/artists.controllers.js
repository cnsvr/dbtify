const db = require('../db/connection');

const allArtist = (req, res, next) => {
  try {
    const query = `SELECT artist_name,artist_surname FROM artist`;
    db.query(query,(err,result) => {
      if (err) {
        res.status(422);
        next(new Error('Database Error'));
      } else {
        res.send({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

const popularArtist = (req, res, next) => {
  try {
    const query = `SELECT artist_name,sum(number_of_likes) as number_of_likes FROM song GROUP BY artist_name ORDER BY sum(number_of_likes) DESC`;
    db.query(query,(err,result) => {
      if (err) {
        res.status(422);
        next(new Error(err.sqlMessage));
      } else {
        res.json({result});
      }
    });
  } catch (error) {
    next(error);
  }
}

const getCoArtist = (req, res, next) => {
  const {artist_name : name, artist_surname: surname }  = req.params;
  try {
    const query = `call getCoArtist('${name}', '${surname}')`;
    db.query(query,(err,result) => {
      if (err) {
        res.status(422);
        next(new Error(err.sqlMessage));
      } else {
        res.json({result});
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allArtist,
  popularArtist,
  getCoArtist,
}