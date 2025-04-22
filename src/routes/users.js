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
const { isAuthenticated, isNotAuthenticated } = require('../../middlewares/roleMiddleware');
const sessionVerify = require('../../middlewares/sessionVerify');
const multer = require('multer');
const path = require('path');
const formidable = require('formidable');

// Configuración de multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/users'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'user-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = function(req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos JPEG, PNG y GIF'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
}).single('imagen');

// Middleware para procesar formularios multipart
const processFormData = (req, res, next) => {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        console.log('Procesando formulario multipart con formidable');
        
        // Crear un nuevo objeto formidable
        const form = new formidable.IncomingForm({
            keepExtensions: true,
            maxFileSize: 2 * 1024 * 1024, // 2MB
            multiples: false
        });
        
        // Parsear el formulario
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error al procesar el formulario:', err);
                return res.render('users/register', {
                    errores: {
                        server: {
                            msg: 'Error al procesar el formulario: ' + err.message
                        }
                    },
                    oldData: {},
                    title: 'Registro'
                });
            }
            
            console.log('Campos recibidos:', fields);
            console.log('Archivos recibidos:', files);
            
            // Asignar los campos al req.body
            req.body = fields;
            
            // Asignar los archivos
            if (files.imagen) {
                req.file = {
                    fieldname: 'imagen',
                    originalname: files.imagen.originalFilename,
                    mimetype: files.imagen.mimetype,
                    size: files.imagen.size,
                    path: files.imagen.filepath
                };
            }
            
            console.log('=== DESPUÉS DE PROCESAR FORMULARIO ===');
            console.log('Body:', req.body);
            console.log('File:', req.file);
            
            next();
        });
    } else {
        next();
    }
};

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
    if (err) {
        console.error('Error de Multer:', err);
        return res.render('users/register', {
            errores: {
                imagen: {
                    msg: err.message || 'Error al procesar la imagen'
                }
            },
            oldData: req.body,
            title: 'Registro'
        });
    }
    next();
};

// Rutas de login
router.get('/login', isNotAuthenticated, login);
router.post('/login', isNotAuthenticated, loginValidator, processLogin);

// Rutas de registro
router.get('/register', isNotAuthenticated, register);
router.post('/register', 
    isNotAuthenticated,
    (req, res, next) => {
        console.log('=== INICIO DE REGISTRO ===');
        console.log('Headers:', req.headers);
        next();
    },
    (req, res, next) => {
        // Verificar si es un formulario multipart
        if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
            console.log('Procesando formulario multipart con formidable');
            
            // Crear un nuevo objeto formidable
            const form = new formidable.IncomingForm({
                keepExtensions: true,
                maxFileSize: 2 * 1024 * 1024, // 2MB
                multiples: false
            });
            
            // Parsear el formulario
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('Error al procesar el formulario:', err);
                    return res.render('users/register', {
                        errores: {
                            server: {
                                msg: 'Error al procesar el formulario: ' + err.message
                            }
                        },
                        oldData: {},
                        title: 'Registro'
                    });
                }
                
                console.log('Campos recibidos:', fields);
                console.log('Archivos recibidos:', files);
                
                // Asignar los campos al req.body
                req.body = fields;
                
                // Asignar los archivos
                if (files.imagen) {
                    req.file = {
                        fieldname: 'imagen',
                        originalname: files.imagen.originalFilename,
                        mimetype: files.imagen.mimetype,
                        size: files.imagen.size,
                        path: files.imagen.filepath
                    };
                }
                
                console.log('=== DESPUÉS DE PROCESAR FORMULARIO ===');
                console.log('Body:', req.body);
                console.log('File:', req.file);
                
                if (!req.body || Object.keys(req.body).length === 0) {
                    return res.render('users/register', {
                        errores: {
                            server: {
                                msg: 'No se recibieron datos del formulario'
                            }
                        },
                        oldData: {},
                        title: 'Registro'
                    });
                }
                
                next();
            });
        } else {
            next();
        }
    },
    registerValidator,
    processRegister
);

// Rutas de perfil
router.get('/profile', sessionVerify, profile);
router.put('/profile', 
    sessionVerify,
    (req, res, next) => {
        // Verificar si es un formulario multipart
        if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
            console.log('Procesando formulario multipart con formidable');
            
            // Crear un nuevo objeto formidable
            const form = new formidable.IncomingForm({
                keepExtensions: true,
                maxFileSize: 2 * 1024 * 1024, // 2MB
                multiples: false
            });
            
            // Parsear el formulario
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('Error al procesar el formulario:', err);
                    return res.render('users/profile', {
                        errores: {
                            server: {
                                msg: 'Error al procesar el formulario: ' + err.message
                            }
                        },
                        oldData: {},
                        title: 'Perfil'
                    });
                }
                
                // Asignar los campos al req.body
                req.body = fields;
                
                // Asignar los archivos
                if (files.imagen) {
                    req.file = {
                        fieldname: 'imagen',
                        originalname: files.imagen.originalFilename,
                        mimetype: files.imagen.mimetype,
                        size: files.imagen.size,
                        path: files.imagen.filepath
                    };
                }
                
                next();
            });
        } else {
            next();
        }
    },
    profileValidator,
    update
);

// Ruta de eliminación de cuenta
router.delete('/profile', isAuthenticated, deleteUser);

// Ruta de logout
router.get('/logout', logout);

module.exports = router;