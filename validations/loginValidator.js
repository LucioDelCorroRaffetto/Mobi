const { body } = require('express-validator');
const { Usuario } = require('../src/database/models');
const bcrypt = require('bcrypt');

module.exports = [
    body('email')
        .notEmpty().withMessage('El campo email no puede estar vacío')
        .isEmail().withMessage('Debe ingresar un email válido')
        .custom(async (value) => {
            const usuario = await Usuario.findOne({
                where: { email: value, activo: true }
            });
            
            if (!usuario) {
                throw new Error('El email no está registrado o la cuenta está inactiva');
            }
            
            return true;
        }),
    
    body('password')
        .notEmpty().withMessage('El campo contraseña no puede estar vacío')
];