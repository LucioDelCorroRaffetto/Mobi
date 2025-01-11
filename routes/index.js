const express = require('express');
const router = express.Router();
const productsRouter = require('./inmuebles');
const cartController = require('../controllers/productCart');
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));

router.get('/', function(req, res, next) {
    res.render('partials/carrousel', { title: 'Publicidad'});
});

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Página de Inicio', products });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register' });
});

router.get('/product', function(req, res, next) {
  res.render('productDetail', { title: 'product', products });
});

router.get('/productDetail', function(req, res, next) {
  res.render('productDetail', { title: 'productDetail', products });
});

router.get('/productCart', cartController.loadCart);

// Rutas de productos
router.use('/cart', productsRouter);
router.use('/index', productsRouter);

module.exports = router;