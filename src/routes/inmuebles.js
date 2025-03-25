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
router.get('/products/:id', productDetail);
router.get('/search', search);

// Rutas protegidas
router.get('/products/create', isAuthenticated, isAdmin, createForm);
router.post('/products', isAuthenticated, isAdmin, upload.single('foto'), store);
router.get('/products/:id/edit', isAuthenticated, isAdmin, editForm);
router.put('/products/:id', isAuthenticated, isAdmin, upload.single('foto'), update);
router.delete('/products/:id', isAuthenticated, isAdmin, destroy);

module.exports = router;