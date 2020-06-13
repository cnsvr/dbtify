const express = require('express');
const router = express.Router();

const controllers = require('../controllers/listeners.controllers');


// get all Listeners
router.get('/', controllers.allListeners);


module.exports = router;