const express = require('express');
const router = express.Router();
const { 
    login, 
    register, 
    processRegister, 
    processLogin, 
    profile, 
    update, 
    logout 
} = require('../controllers/usersControllers');
const registerValidator = require('../../validations/registerValidator');
const loginValidator = require('../../validations/loginValidator');
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

// Rutas de autenticación
router.get('/login', loginVerify, login);
router.post('/login', loginValidator, processLogin);

// Rutas de registro
router.get('/register', loginVerify, register);
router.post('/register', upload.single('image'), registerValidator, processRegister);

// Rutas de perfil
router.get('/profile', profile);
router.post('/profile', upload.single('image'), update);

// Ruta de logout
router.get('/logout', logout);

module.exports = router;