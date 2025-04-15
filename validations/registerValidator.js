const {body} = require('express-validator');
const { Usuario } = require('../src/database/models');

module.exports = [
    body('nombre').notEmpty().withMessage('El campo no puede estar vacio').bail().trim()
        .isAlpha().withMessage('No se permiten numeros o caracteres especiales').bail()
        .isLength({ min: 2, max: 50 }).withMessage("El minimo de caracteres es 2 y el maximo 50").bail(),

    body('apellido').notEmpty().withMessage('El campo no puede estar vacio').bail().trim()
        .isAlpha().withMessage('No se permiten numeros o caracteres especiales').bail()
        .isLength({ min: 2, max: 50 }).withMessage("El minimo de caracteres es 2 y el maximo 50").bail(),

    body('password').notEmpty().withMessage('El campo no puede estar vacio').bail()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/).withMessage("No cumple con los requisitos, debe contener una mayuscula, minuscula, un valor numerico y un caracter especial. La longitud debe ser entre 8 y 20 caracteres").bail(),

    body('email').notEmpty().withMessage('El campo no puede estar vacio').bail()
    .isEmail().withMessage('El campo debe ser un email').bail()
    .custom(async (value) => {
        const usuario = await Usuario.findOne({
            where: { email: value }
        });
        
        if (usuario) {
            throw new Error('Este email ya está registrado');
        }
        
        return true;
    }).bail(),

    body('image')
    .custom((value, { req }) => {
        if (!req.file) return true;
        
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new Error('Solo se permiten imágenes PNG, JPG o GIF');
        }
        
        const maxSize = 2 * 1024 * 1024;
        if (req.file.size > maxSize) {
            throw new Error('El archivo no debe superar los 2MB');
        }
        
        return true;
    }).bail()
]