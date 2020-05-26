const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpStatus = require('http-status-codes');

const db = require('../db/connection');

const Errors = require('../error');

const router = express.Router();

const config = require('../../config');

const listenerSchema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(67).required(),
  email: Joi.string().regex(/(^\S+@\S+$)/).required(),
  password: Joi.string().trim().min(8).required()
});

const artistSchema = Joi.object().keys({
  name: Joi.string().regex(/(^[a-zA-Z]+$)/).min(2).max(67).required(),
  surname: Joi.string().regex(/(^[a-zA-Z]+$)/).min(2).max(67).required(),
  password: Joi.string().trim().min(8).required()
});

router.get('/', (req, res) => {
  res.json({
    message: '✅'
  });
});

// db.connect(err=>{
//   if (err) {
//     res.status(HttpStatus.BAD_GATEWAY);
//     next(new Errors.BadRequest(err.sqlMessage));
//   }
// });


const createTokenSendResponse =  (user,res,next) => {
  let payload = {};
  if (user.role === 'listener'){
    payload = {
      user: user.user,
      role: user.role,
    }
  } else {
    payload = {
      user : user.user,
      role: user.role,
    }
  }
  jwt.sign(payload, config.token_secret, {
    expiresIn:'1h',
  },(err, token) => {
    if (err) {
      console.log(err);
      res.status(422);
      next(new Errors.UnprocessableEntity('Unable to login'));
    }else {
      // localStorage.token = token;
      res.send({token});
      
    }
  }); 
  
};

router.post('/listener/signup',(req, res, next) => {
  const result = Joi.validate(req.body, listenerSchema);
  if (result.error === null) {
    // checks username from db. if there exists or not
      // if there is not, put user into db.
      const { username, email, password } = req.body;
      const query = `INSERT INTO listener VALUES (?)`;
      bcrypt.hash(password.trim(),12).then(hashPassword => {
        db.query(query,[[username,email,hashPassword]], (err,result,fields) => {
          if (err) {
            const error = new Errors.Conflict('That username or email is avaiable!!');
            res.status(HttpStatus.CONFLICT);
            next(error);
          } else {
            const createdUser = {
              user: username,
              role:'listener'
            };
            createTokenSendResponse(createdUser,res,next);
          }
        });
      });
  } else {
    res.status(422);
    next(result.error);
  }
});

function respondError422(res, next) {
  res.status(HttpStatus.UNPROCESSABLE_ENTITY);
  const error = new Errors.UnprocessableEntity('Unable to login.');
  next(error);
}

router.get('/listener/login', (req,res,next) => {
  const result = Joi.validate(req.body,listenerSchema);
  if (result.error === null) {
    const {username,email,password} = req.body;
    const query = 'SELECT username,email,password FROM listener WHERE username = ? AND email = ?';
    db.query(query,[username,email],(err,result) => {
      if (err) {
        res.json({err});
      } else {
        if (result.length == 0) {
          // unable to login ...
          respondError422(res,next);
        } else {
          bcrypt.compare(password,result[0].password).then(result => {
            if (result) {
              // res.json({result}); // LOGGED IN.
              const user = {
                user : username,
                role: 'listener'
              }
              createTokenSendResponse(user,res,next);
            } else {
              respondError422(res,next);
            }
          });
        }
      }
    })
  } else {
    res.status(422);
    next(result.error);
  }

});

router.post('/artist/signup',(req, res, next) => {
  const result = Joi.validate(req.body, artistSchema);
  if (result.error === null) {
    // checks username from db. if there exists or not
      // if there is not, put user into db.
      const { name, surname, password } = req.body;
      const query = `INSERT INTO artist VALUES (?)`;
      bcrypt.hash(password.trim(),12).then(hashPassword => {
        db.query(query,[[name,surname,hashPassword]], (err,result,fields) => {
          if (err) {
            const error = new Errors.Conflict('That name or surname is avaiable!!');
            res.status(HttpStatus.CONFLICT);
            next(error);
          } else {
            // res.json({result});
            const createdUser = {
              user:name,
              role:'artist'
            };
            createTokenSendResponse(createdUser,res,next);
          }
        });
      });
  } else {
    res.status(422);
    next(result.error);
  }
});

router.get('/artist/login', (req,res,next) => {
  const result = Joi.validate(req.body,artistSchema);
  if (result.error === null) {
    const {name,surname,password} = req.body;
    const query = 'SELECT artist_name,artist_surname,password FROM artist WHERE artist_name = ? AND artist_surname = ?';
    db.query(query,[name,surname],(err,result) => {
      if (err) {
        res.json({err});
      } else {
        if (result.length == 0) {
          // unable to login ...
          respondError422(res,next);
        } else {
          bcrypt.compare(password,result[0].password).then(artist => {
            if (artist) {
              // LOGGED IN.
              // req.loggingInUser = {
              //   user : result[0].artist_name,
              //   role : 'artist'
              // }
              const user = {
                user: name,
                role:'artist',
              };
              createTokenSendResponse(user,res,next);
            } else {
              respondError422(res,next);
            }
          });
        }
      }
    })
  } else {
    res.status(422);
    next(result.error);
  }
});


module.exports = router;
