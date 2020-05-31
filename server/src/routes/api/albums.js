const express = require('express');
const router = express.Router();

const controllers = require('../controllers/albums.controllers');

// List all albums
router.get('/',controllers.allAlbums);

// Add album 
router.post('/:artist_name', controllers.addAlbum);

// List albums of artist
router.get('/:artist_name',controllers.artistAlbum);

// update album of artist
router.patch('/:artist_name/:id',controllers.updateOne);

//  like album

router.patch('/:album_id',controllers.likeAlbum);

// delete album of artist

router.delete('/:artist_name/:id',controllers.deleteAlbum);




module.exports = router;