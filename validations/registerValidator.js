const { body } = require('express-validator');
const { Usuario } = require('../src/database/models');

const registerValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
        .trim(),
    
    body('apellido')
        .notEmpty().withMessage('El apellido es requerido')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres')
        .trim(),
    
    body('email')
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail()
        .custom(async (value) => {
            try {
                console.log('Validando email:', value);
                const usuarioExistente = await Usuario.findOne({ where: { email: value } });
                if (usuarioExistente) {
                    console.log('Email ya existe:', value);
                    throw new Error('El email ya está registrado');
                }
                return true;
            } catch (error) {
                throw new Error(error.message);
            }
        }),
    
    body('genero')
        .notEmpty().withMessage('El género es requerido')
        .isIn(['masculino', 'femenino', 'otro', 'prefiero_no_decir']).withMessage('Género no válido'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'),
    
    body('confirmPassword')
        .notEmpty().withMessage('Debes confirmar tu contraseña')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
];

module.exports = registerValidator;