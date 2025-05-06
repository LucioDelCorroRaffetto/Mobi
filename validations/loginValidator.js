const { body } = require('express-validator');
const { Usuario } = require('../src/database/models');

module.exports = [
    body('email')
        .notEmpty().withMessage('Credenciales inválidas')
        .isEmail().withMessage('Credenciales inválidas')
        .custom(async (value) => {
            const usuario = await Usuario.findOne({
                where: { email: value, activo: true }
            });
            
            if (!usuario) {
                throw new Error('Credenciales inválidas');
            }
            
            return true;
        }),
    
    body('password')
        .notEmpty().withMessage('Credenciales inválidas')
];