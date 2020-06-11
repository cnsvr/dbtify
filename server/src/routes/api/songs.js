const express = require('express');
const router = express.Router();

const controllers = require('../controllers/songs.controllers');

// List all songs
router.get('/', controllers.allSongs);

// get songs of album.
router.get('/:album_id(\\d*)', controllers.songsOfAlbum );

// get song of artist.
router.get('/:artist_name',controllers.songsOfArtist);

// get popular song of artist.

router.get('/:artist_name/popular',controllers.popularSongOfArtist);

// get songs of a specific genre.

router.get('/genres/:genre',controllers.songsOfGenre);

// get songs contain this keyword in their titles.

router.get('/search/:keyword',controllers.searchSong);


// add song into album of artist.
router.post('/:artist_name/:album_id',controllers.addSong);

// dislike song

router.patch('/dislike/:song_id',controllers.disLike);

// update song title of album of artist.

router.patch('/:artist_name/:song_id',controllers.updateSong);

// like song

router.patch('/:song_id',controllers.likeSong);



// delete song of artist

router.delete('/:artist_name/:song_id',controllers.deleteSong);


module.exports = router;