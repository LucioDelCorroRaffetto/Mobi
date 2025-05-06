const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../../middlewares/auth');
const { Admin, listProperties, showAddForm, store, showEditForm, update, destroy, getAllUsers, updateUserRole } = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../public/images/products');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF)'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Rutas de administración
router.get('/', isAuthenticated, Admin, listProperties); // Panel de administración
router.get('/products', isAuthenticated, Admin, listProperties); // Lista de productos
router.get('/products/create', isAuthenticated, Admin, showAddForm); // Formulario de creación
router.post('/products', isAuthenticated, Admin, upload.single('foto'), store); // Crear producto
router.get('/products/:id/edit', isAuthenticated, Admin, showEditForm); // Formulario de edición
router.put('/products/:id', isAuthenticated, Admin, upload.single('foto'), update); // Actualizar producto
router.delete('/products/:id', isAuthenticated, Admin, destroy); // Eliminar producto

// Rutas de gestión de usuarios
router.get('/users', isAuthenticated, Admin, getAllUsers); // Lista de usuarios
router.put('/users/:userId/role', isAuthenticated, Admin, updateUserRole); // Actualizar rol de usuario

module.exports = router;