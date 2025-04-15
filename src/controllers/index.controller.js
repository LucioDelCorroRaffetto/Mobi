const express = require('express');
const router = express.Router();
const { Propiedad, Direccion, Barrio, Categoria, Usuario } = require('../database/models');

const indexController = {
    home: async (req, res) => {
        try {
            const properties = await Propiedad.findAll({
                include: [
                    { model: Direccion, as: 'direccion' },
                    { model: Barrio, as: 'barrio' },
                    { model: Categoria, as: 'categoria' },
                    { model: Usuario, as: 'agente' }
                ],
                where: {
                    estado: 'disponible'
                },
                order: [['createdAt', 'DESC']],
                limit: 6,
                paranoid: false
            });

            res.render('carrousel', {
                title: 'Inicio',
                products: properties
            });
        } catch (error) {
            console.error('Error al cargar las propiedades destacadas:', error);
            res.render('carrousel', {
                title: 'Inicio',
                products: []
            });
        }
    }
};

// Manejo de errores 404
router.use((req, res) => {
    res.status(404).render('error', { title: 'Error 404', message: 'Página no encontrada' });
});

module.exports = indexController;