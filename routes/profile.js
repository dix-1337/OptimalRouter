const express = require('express');
const authMiddleware = require('../middleware/auth');
const controller = require('../controllers/authController');

const router = express.Router();

router.get('/', authMiddleware, controller.getProfile);

module.exports = router;