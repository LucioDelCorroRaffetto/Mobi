const express = require('express');
const router = express.Router();
const cartController = require('../controllers/productCart');


// Ruta para cargar el carrito
router.get('/', cartController.loadCart);

// Ruta para eliminar un producto del carrito
router.post('/remove/:id', cartController.removeItem);

module.exports = router;