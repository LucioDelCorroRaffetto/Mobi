var express = require('express'); // Se requiere el módulo de Express
var router = express.Router(); // Se crea un objeto Router de Express

/* GET página de inicio. */
router.get('/home', function(req, res, next) {
  // Se renderiza la vista 'home'
  res.render('home', { title: 'Página de Inicio' });
});

// Se exporta el objeto Router
module.exports = router;