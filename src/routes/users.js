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
const loginValidator = require('../../validations/loginValidator');
const registerValidator = require('../../validations/registerValidator');
const profileValidator = require('../../validations/profileValidator');
const loginVerify = require('../../middlewares/loginValidate');

const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/users'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/users/login');
    }
};

// Rutas de login
router.get('/login', loginVerify, login);
router.post('/login', loginValidator, processLogin);

// Rutas de registro
router.get('/register', loginVerify, register);
router.post('/register', upload.single('image'), registerValidator, processRegister);

// Rutas de perfil
router.get('/profile', isAuthenticated, profile);
router.post('/profile', isAuthenticated, upload.single('image'), profileValidator, update);

// Ruta de eliminación de cuenta
router.delete('/profile', isAuthenticated, deleteUser);

// Ruta de logout
router.get('/logout', logout);

module.exports = router;