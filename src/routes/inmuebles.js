const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Rutas públicas de inmuebles
router.get('/', productsController.allProducts); // Lista todos los inmuebles
router.get('/search', productsController.search); // Búsqueda de inmuebles
router.get('/:id', productsController.productDetail); // Detalle de un inmueble

module.exports = router;