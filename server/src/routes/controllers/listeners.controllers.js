const db = require('../db/connection');

const allListeners = (req, res, next) => {
  try {
    const query = `SELECT username,email FROM listener`;
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

module.exports = {
  allListeners,
};