const express = require('express');
const router = express.Router();
const productsRouter = require('./inmuebles');
const adminRouter = require('./admin');
const usersRouter = require('./users');
const productsController = require('../controllers/productsController');
const { isAuthenticated } = require('../../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
const favoriteController = require('../controllers/favoriteController');
const commentController = require('../controllers/commentController');

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

// Ruta de favoritos
router.get('/favorites', isAuthenticated, favoriteController.getFavorites);

// Rutas de administración - IMPORTANTE: debe ir antes de /inmuebles
router.use('/admin', adminRouter);

// Rutas de usuarios
router.use('/users', usersRouter);

// Rutas de productos
router.use('/inmuebles', productsRouter);

// Rutas de la API
// Rutas de comentarios
router.get('/api/comments/product/:productId', commentController.getComments);
router.post('/api/comments/product/:productId', isAuthenticated, commentController.createComment);
router.delete('/api/comments/:commentId', isAuthenticated, commentController.deleteComment);

// Rutas de favoritos
router.get('/api/favorites', isAuthenticated, favoriteController.getFavorites);
router.get('/api/favorites/check/:productId', isAuthenticated, favoriteController.checkFavorite);
router.post('/api/favorites/:productId', isAuthenticated, favoriteController.addFavorite);
router.delete('/api/favorites/:productId', isAuthenticated, favoriteController.removeFavorite);

// Manejo de errores 404
router.use((req, res) => {
    res.status(404).render('error', { 
        title: 'Error 404', 
        message: 'Página no encontrada',
        error: { status: 404 }
    });
});

module.exports = router;