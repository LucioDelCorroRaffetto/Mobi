const { body } = require('express-validator');

const profileValidator = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    
    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
    
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido'),
    
    body('telefono')
        .optional()
        .isMobilePhone().withMessage('Debe ser un número de teléfono válido'),
    
    body('password')
        .optional()
        .if(body('password').notEmpty())
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    
    body('password_confirm')
        .optional()
        .if(body('password').notEmpty())
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
];

module.exports = profileValidator; 