const { Propiedad, Direccion, Barrio, Categoria, Usuario } = require('../database/models');

const cartController = {
    loadCart: async (req, res) => {
        try {
            // Obtener las propiedades del carrito desde la base de datos
            const properties = await Propiedad.findAll({
                include: [
                    { 
                        model: Direccion,
                        as: 'direccion',
                        include: [
                            {
                                model: Barrio,
                                as: 'barrio'
                            }
                        ]
                    },
                    { model: Categoria, as: 'categoria' },
                    { model: Usuario, as: 'agente' }
                ],
                where: {
                    estado: 'disponible'
                },
                order: [['createdAt', 'DESC']],
                limit: 5
            });

            // Formatear los datos para la vista
            const cartItems = properties.map(property => ({
                id: property.id,
                titulo: property.titulo,
                descripcion: property.descripcion,
                precio: property.precio,
                moneda: property.moneda || 'ARS',
                foto: property.foto || '/images/products/imageDefault.png',
                direccion: {
                    calle: property.direccion?.calle || 'Sin dirección',
                    numero: property.direccion?.numero || '',
                    barrio: {
                        nombre: property.direccion?.barrio?.nombre || 'Sin barrio'
                    }
                }
            }));

            // Calcular totales
            const subtotal = cartItems.reduce((sum, item) => sum + (item.precio || 0), 0);
            const taxes = subtotal * 0.15;
            const total = subtotal + taxes;

            res.render('products/productCart', { 
                title: 'Carrito de Compras', 
                cartItems: cartItems,
                subtotal: subtotal,
                taxes: taxes,
                total: total
            });
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            res.render('products/productCart', { 
                title: 'Carrito de Compras', 
                cartItems: [],
                subtotal: 0,
                taxes: 0,
                total: 0,
                error: 'No se pudo cargar el carrito'
            });
        }
    },

    removeItem: async (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            // Aquí iría la lógica para eliminar el item del carrito
            // Por ahora solo redirigimos
            res.redirect('/carts');
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            res.redirect('/carts?error=No se pudo eliminar el producto');
        }
    }
};

module.exports = cartController;