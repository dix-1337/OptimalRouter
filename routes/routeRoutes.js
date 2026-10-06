const express = require('express');
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const controller = require('../controllers/routeController');

const router = express.Router();

router.get('/', authMiddleware, controller.getAll);

router.get('/:id', authMiddleware, controller.getById);

router.post('/', authMiddleware, controller.create);

router.put('/:id', authMiddleware, isAdmin, controller.update);

router.delete('/:id', authMiddleware, isAdmin, controller.remove);

module.exports = router;