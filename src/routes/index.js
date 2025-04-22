const express = require('express');
const router = express.Router();
const productsRouter = require('./inmuebles');
const adminRouter = require('./admin');
const usersControllers = require('../controllers/usersControllers');
const cartController = require('../controllers/productCart');
const productsController = require('../controllers/productsController');
const { isAuthenticated, isAdmin } = require('../../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

// Configuración de multer para imágenes de usuario
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images/users'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const userUpload = multer({ storage: userStorage });

// Rutas principales
// Ruta principal - muestra el carrusel de publicidad
router.get('/', productsController.index);

// Ruta de inicio
router.get('/home', productsController.index);

// Rutas de productos
router.get('/products', productsController.allProducts);
router.get('/products/detail/:id', productsController.productDetail);
router.get('/products/cart', isAuthenticated, cartController.loadCart);

// Rutas de usuarios
router.get('/users/login', usersControllers.login);
router.post('/users/login', usersControllers.processLogin);
router.get('/users/register', usersControllers.register);
router.post('/users/register', usersControllers.processRegister);
router.get('/users/profile', isAuthenticated, usersControllers.profile);
router.put('/users/update', isAuthenticated, usersControllers.update);
router.delete('/users/delete', isAuthenticated, usersControllers.delete);
router.get('/users/logout', usersControllers.logout);

// Rutas del carrito
router.get('/productCart', isAuthenticated, cartController.loadCart);
router.get('/carts', isAuthenticated, cartController.loadCart);

// Rutas de administración - IMPORTANTE: debe ir antes de /inmuebles
router.use('/admin', adminRouter);

// Rutas de productos
router.use('/inmuebles', productsRouter);

// Manejo de errores 404
router.use((req, res) => {
    res.status(404).render('error', { 
        title: 'Error 404', 
        message: 'Página no encontrada',
        error: { status: 404 }
    });
});

module.exports = router;