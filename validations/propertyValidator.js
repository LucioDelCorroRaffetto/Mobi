const { body } = require('express-validator');
const { Usuario, Barrio, Categoria } = require('../src/database/models');

module.exports = [
    body('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ min: 5 }).withMessage('El título debe tener al menos 5 caracteres'),

    body('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres'),

    body('precio')
        .notEmpty().withMessage('El precio es obligatorio')
        .isNumeric().withMessage('El precio debe ser un número')
        .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),

    body('barrio_id')
        .notEmpty().withMessage('El barrio es obligatorio')
        .isInt().withMessage('El barrio debe ser un número válido')
        .custom(async (value) => {
            const barrio = await Barrio.findByPk(value);
            if (!barrio) {
                throw new Error('El barrio seleccionado no existe');
            }
            return true;
        }),

    body('categoria_id')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isInt().withMessage('La categoría debe ser un número válido')
        .custom(async (value) => {
            const categoria = await Categoria.findByPk(value);
            if (!categoria) {
                throw new Error('La categoría seleccionada no existe');
            }
            return true;
        }),

    body('foto')
        .custom((value, { req }) => {
            if (!req.file) return true; // Si no hay archivo, permitir continuar
            
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                throw new Error('El archivo debe ser una imagen válida (JPG, JPEG, PNG, GIF)');
            }
            
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (req.file.size > maxSize) {
                throw new Error('La imagen no debe superar los 5MB');
            }
            
            return true;
        })
]; 