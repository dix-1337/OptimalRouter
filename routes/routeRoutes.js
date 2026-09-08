const express = require('express');
const router = express.Router();
const controller = require('../controllers/routeController');

router.get('/', controller.getAll);        // GET    /routes
router.get('/:id', controller.getById);    // GET    /routes/:id
router.post('/', controller.create);       // POST   /routes
router.put('/:id', controller.update);     // PUT    /routes/:id
router.delete('/:id', controller.remove);  // DELETE /routes/:id

module.exports = router;