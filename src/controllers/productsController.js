const db = require('../../database/models');
const { Producto, Usuario } = db;
const { Op } = require('sequelize');

const productsController = {
    allProducts: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 10; // productos por página
    
            const { count, rows: productos } = await Producto.findAndCountAll({
                include: ['propietario', 'agente'],
                limit,
                offset: (page - 1) * limit
            });
    
            const totalPages = Math.ceil(count / limit);
    
            res.render('products/products', { 
                title: 'Lista de Todos los Productos', 
                resultadoInmueble: productos,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            });
        } catch (error) {
            next(error);
        }
    },

    productDetail: async (req, res, next) => {
        try {
            const product = await Producto.findByPk(req.params.id, {
                include: ['propietario', 'agente']
            });
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            res.render('products/productDetail', { 
                title: 'Detalle del Producto',
                product 
            });
        } catch (error) {
            next(error);
        }
    },

    store: async (req, res, next) => {
        try {
            await Producto.create({
                direccion: req.body.direccion,
                barrio: req.body.barrio,
                zona: req.body.zona,
                ambientes: parseInt(req.body.ambientes),
                precio: parseFloat(req.body.precio),
                tipo: req.body.tipo,
                foto: req.body.foto,
                m2: parseInt(req.body.m2),
                propietario_id: req.body.propietario_id,
                agente_id: req.body.agente_id
            });
            res.redirect('/inmuebles/products');
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (!producto) {
                return res.status(404).send('Producto no encontrado');
            }
            await producto.update({
                direccion: req.body.direccion,
                barrio: req.body.barrio,
                zona: req.body.zona,
                ambientes: parseInt(req.body.ambientes),
                precio: parseFloat(req.body.precio),
                tipo: req.body.tipo,
                foto: req.body.foto,
                m2: parseInt(req.body.m2)
            });
            res.redirect('/inmuebles/products');
        } catch (error) {
            next(error);
        }
    },

    search: async (req, res, next) => {
        try {
            const { query } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = 10;

            const { count, rows: productos } = await Producto.findAndCountAll({
                where: {
                    [Op.or]: [
                        { direccion: { [Op.like]: `%${query}%` } },
                        { barrio: { [Op.like]: `%${query}%` } },
                        { zona: { [Op.like]: `%${query}%` } }
                    ]
                },
                include: ['propietario', 'agente'],
                limit,
                offset: (page - 1) * limit
            });

            const totalPages = Math.ceil(count / limit);

            res.render('products/search', { 
                productos, 
                query,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            });
        } catch (error) {
            next(error);
        }
    },

    destroy: async (req, res, next) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (!producto) {
                return res.status(404).send('Producto no encontrado');
            }
            await producto.destroy();
            res.redirect('/admin?message=Producto eliminado exitosamente');
        } catch (error) {
            next(error);
        }
    },

    createForm: async (req, res, next) => {
        try {
            const agentes = await Usuario.findAll({
                where: { tipo: 'agente', activo: true }
            });
            res.render('products/productAdd', { 
                title: 'Crear Nuevo Producto',
                agentes 
            });
        } catch (error) {
            next(error);
        }
    },

    editForm: async (req, res, next) => {
        try {
            const producto = await Producto.findByPk(req.params.id);
            if (!producto) {
                return res.status(404).send('Producto no encontrado');
            }

            const agentes = await Usuario.findAll({
                where: { tipo: 'agente', activo: true }
            });

            res.render('products/productEdit', { 
                title: 'Editar Producto',
                producto,
                agentes 
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = productsController;