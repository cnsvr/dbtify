const express = require('express');
const router = express.Router();

const controllers = require('../controllers/artists.controllers');


router.get('/', controllers.allArtist);

module.exports = router;