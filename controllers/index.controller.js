const express = require('express');
const productsController = require('./productsController');
const usersController = require('./usersController'); // Se agregó la importación de usersController

const router = express.Router();

// Ruta de inicio
router.get('/', (req, res) => {
    res.send('Bienvenido a la API de bicicletas. Usa /productos para ver productos y /usuarios para ver usuarios.');
});

// Integración de rutas de productos
router.get('/productos', productsController.all);
router.get('/productos/:id', productsController.detail);

// Integración de rutas de usuarios
router.get('/usuarios', usersController.all);
router.get('/usuarios/:id', usersController.detail);

// Manejo de errores 404
router.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

module.exports = router;