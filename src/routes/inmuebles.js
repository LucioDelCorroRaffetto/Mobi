const express = require('express');
const router = express.Router();
const { 
    allProducts,
    createForm,
    productDetail, 
    store,
    editForm,
    update,
    destroy,
    search
} = require('../controllers/productsController');
const { isAuthenticated, isAdmin } = require('../../middlewares/auth');
const propertyValidator = require('../../validations/propertyValidator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/products'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas públicas
router.get('/products', allProducts);
router.get('/search', search);
router.get('/products/create', isAuthenticated, isAdmin, createForm);
router.post('/products', isAuthenticated, isAdmin, upload.single('foto'), propertyValidator, store);
router.get('/products/:id/edit', isAuthenticated, isAdmin, editForm);
router.put('/products/:id', isAuthenticated, isAdmin, upload.single('foto'), propertyValidator, update);
router.delete('/products/:id', isAuthenticated, isAdmin, destroy);
router.get('/products/:id', productDetail);

module.exports = router;