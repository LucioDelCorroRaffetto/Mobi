const express = require('express');
const router = express.Router();
const productsRouter = require('./inmuebles');
const cartController = require('../controllers/productCart');
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));

// Ruta principal - muestra el carrusel de publicidad
router.get('/', function(req, res, next) {
    res.render('carrousel', { title: 'Publicidad'});
});

// Ruta de inicio
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Página de Inicio', products });
});

router.get('/admin', function(req, res, next) {
  res.render('products/admin', { title: 'Página de edicion', products });
});

// Rutas de autenticación
router.get('/login', function(req, res, next) {
  res.render('users/login', { title: 'Iniciar Sesión' });
});

router.get('/register', function(req, res, next) {
  res.render('users/register', { title: 'Registrarse' });
});

// Rutas de productos - unificadas
router.get('/product', function(req, res, next) {
  res.render('products/productDetail', { title: 'Detalle del Inmueble', products });
});

// Ruta del carrito
router.get('/productCart', cartController.loadCart);

// Rutas adicionales de productos
router.use('/cart', productsRouter);
router.use('/inmuebles', productsRouter);

module.exports = router;