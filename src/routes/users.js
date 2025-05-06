const express = require('express');
const router = express.Router();
const { 
    login, 
    processLogin,
    register, 
    processRegister,
    logout,
    profile,
    update,
    delete: deleteUser 
} = require('../controllers/usersControllers');
const { isAuthenticated} = require('../../middlewares/auth');
const {isNotAuthenticated} = require('../../middlewares/roleMiddleware');
const loginValidator = require('../../validations/loginValidator');
const registerValidator = require('../../validations/registerValidator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para imágenes de usuario
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '../../public/images/users');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'user-' + uniqueSuffix + path.extname(file.originalname));
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

// Rutas de login
router.get('/login', isNotAuthenticated, login);
router.post('/login', isNotAuthenticated, loginValidator, processLogin);

// Rutas de registro
router.get('/register', isNotAuthenticated, register);
router.post('/register', isNotAuthenticated, upload.single('imagen'), registerValidator, processRegister);

// Rutas protegidas
router.get('/profile', isAuthenticated, profile);
router.post('/update', isAuthenticated, upload.single('imagen'), update);
router.delete('/delete', isAuthenticated, deleteUser);
router.get('/logout', logout);

module.exports = router;