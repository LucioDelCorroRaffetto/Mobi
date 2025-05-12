const { render } = require('ejs');
const { Favorite, Propiedad, Direccion, Barrio, Categoria, Usuario } = require('../database/models');

const favoriteController = {
    // Obtener favoritos de un usuario (vista)
    getFavorites: async (req, res) => {
        try {
            const userId = req.session.user.id;
            const favorites = await Favorite.findAll({
                where: { usuario_id: userId },
                include: [{
                    model: Propiedad,
                    as: 'propiedad',
                    include: [
                        {
                            model: Direccion,
                            as: 'direccion'
                        },
                        {
                            model: Barrio,
                            as: 'barrio'
                        },
                        {
                            model: Categoria,
                            as: 'categoria'
                        }
                    ]
                }],
                order: [['created_at', 'DESC']]
            });

            res.render('favorites', {
                title: 'Mis Favoritos',
                user: req.session.user,
                favorites: favorites.map(fav => fav.propiedad),
                error: null
            });
        } catch (error) {
            console.error('Error al obtener favoritos:', error);
            res.status(500).render('error', {
                title: 'Error',
                message: 'Error al cargar los favoritos',
                error: { status: 500 }
            });
        }
    },

    // API: Obtener favoritos de un usuario
    getFavoritesAPI: async (req, res) => {
        try {
            const userId = req.session.user.id;
            const favorites = await Favorite.findAll({
                where: { usuario_id: userId },
                include: [{
                    model: Propiedad,
                    as: 'propiedad',
                    attributes: ['id', 'titulo', 'descripcion', 'precio', 'imagen']
                }],
                order: [['created_at', 'DESC']]
            });
            res.json(favorites.map(fav => fav.propiedad));
        } catch (error) {
            console.error('Error al obtener favoritos:', error);
            res.status(500).json({ error: 'Error al obtener los favoritos' });
        }
    },

    // Agregar un producto a favoritos
    addFavorite: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.session.user.id;

            const [favorite, created] = await Favorite.findOrCreate({
                where: {
                    usuario_id: userId,
                    propiedad_id: productId
                }
            }); 

            if (!created) {
                return res.status(400).json({ error: 'La propiedad ya está en favoritos' });
            }

            res.status(201).json({ message: 'Propiedad agregada a favoritos' });
        } catch (error) {
            console.error('Error al agregar a favoritos:', error);
            res.status(500).json({ error: 'Error al agregar a favoritos' });
        }
    },

    // Eliminar un producto de favoritos
    removeFavorite: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.session.user.id;

            const deleted = await Favorite.destroy({
                where: {
                    usuario_id: userId,
                    propiedad_id: productId
                }
            });

            if (!deleted) {
                return res.status(404).json({ error: 'La propiedad no estaba en favoritos' });
            }

            res.json({ message: 'Propiedad eliminada de favoritos' });
        } catch (error) {
            console.error('Error al eliminar de favoritos:', error);
            res.status(500).json({ error: 'Error al eliminar de favoritos' });
        }
    },

    // Verificar si un producto está en favoritos
    checkFavorite: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.session.user.id;

            const favorite = await Favorite.findOne({
                where: {
                    usuario_id: userId,
                    propiedad_id: productId
                }
            });

            res.json({ isFavorite: !!favorite });
        } catch (error) {
            console.error('Error al verificar favorito:', error);
            res.status(500).json({ error: 'Error al verificar favorito' });
        }
    }
};

module.exports = favoriteController; 