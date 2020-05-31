const express = require('express');
const router = express.Router();

const controllers = require('../controllers/liked_songs.controllers');

router.get('/:username',controllers.likedSongsOfListener);


module.exports = router;