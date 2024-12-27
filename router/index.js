var express = require('express'); // Se requiere el módulo de Express
var router = express.Router(); // Se crea un objeto Router de Express

/* GET página de inicio. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Página de Inicio' });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'home' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'login' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'register' });
});

router.get('/product', function(req, res, next) {
  res.render('product', { title: 'product' });
});

// Se exporta el objeto Router
module.exports = router;