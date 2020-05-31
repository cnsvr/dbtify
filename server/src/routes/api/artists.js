const express = require('express');
const router = express.Router();

const controllers = require('../controllers/artists.controllers');


router.get('/', controllers.allArtist);

// rank all artists by the total number of likes of their songs.
router.get('/popular',controllers.popularArtist);

// get songs of coworkers of artist.

router.get('/:artist_name/:artist_surname',controllers.getCoArtist);

module.exports = router;