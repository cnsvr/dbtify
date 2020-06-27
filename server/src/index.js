const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const path = require('path');
const middlewares = require('./routes/auth/middlewares');

require('dotenv').config();

const app = express();
const auth = require('./routes/auth/index');
const albums = require('./routes/api/albums');
const songs = require('./routes/api/songs');
const artists = require('./routes/api/artists');
const liked_songs = require('./routes/api/liked_songs');
const listeners = require('./routes/api/listeners');
const db = require('./routes/db/connection');

//Middleware
app.use(cors({
  origin: 'http://localhost:8080'
}));
app.use(volleyball);
app.use(express.json());
app.use(middlewares.checkTokenSetUser);

app.use('/auth', auth);
app.use('/api/v1/albums',albums);
app.use('/api/v1/songs',songs);
app.use('/api/v1/artists',artists);
app.use('/api/v1/liked_songs',liked_songs);
app.use('/api/v1/listeners',listeners);

//Static files

/*
app.use(express.static(path.join(__dirname, '../public')));

*/


// Connect to Database

db.connect(err=>{
  if (err) {
    // res.status(HttpStatus.BAD_GATEWAY);
    // next(new Errors.BadRequest(err.sqlMessage));
    console.log(err.sqlMessage);
  }
});


app.get('/', (req, res) => {
  res.json({
    message: 'HEY THERE 👋',
    user: req.user,
  });
})

/*
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
})
*/

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${ req.originalUrl }`);
  next(error);  
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);


const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
