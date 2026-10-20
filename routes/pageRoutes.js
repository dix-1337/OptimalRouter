const express = require('express');
const pageAuth = require('../middleware/pageAuth');
const controller = require('../controllers/pageController');

const router = express.Router();

router.get('/', pageAuth, controller.showIndex);

router.get('/item/:id', pageAuth, controller.showItem);

router.get('/add', pageAuth, controller.showAddForm);

router.post('/add', pageAuth, controller.addItem);

module.exports = router;
