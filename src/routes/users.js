var express = require('express');
var router = express.Router();
const {login,register,store,profile,processLogin,logout} = require('../controllers/usersControllers');
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

/* GET users listing. */
router.get('/login', loginVerify, login);
router.post('/login', loginValidator, processLogin);
router.get('/logout', logout);

router.get('/register', register);
router.post('/register', upload.single('image'), registerValidator, store);

router.get('/profile', profile);

module.exports = router;