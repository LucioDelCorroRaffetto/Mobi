const fs = require('fs');

const productsController = {
    all: (req, res, next) => {
        try {
            const inmueble = req.params.inmueble;
            const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
            const resultadoInmueble = products.filter(product => product.inmueble === inmueble);
            res.render('products/products', { 
                title: resultadoInmueble.length > 0 ? 'Lista de Productos' : 'Error',
                resultadoInmueble: resultadoInmueble.length > 0 ? resultadoInmueble : products,
                message: resultadoInmueble.length > 0 ? null : 'Producto no encontrado'
            });
        } catch (error) {
            next(error);
        }
    },

    allProducts: (_req, res, next) => {
        try {
            const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
            res.render('products/products', { 
                title: 'Lista de Todos los Productos', 
                resultadoInmueble: products 
            });
        } catch (error) {
            next(error);
        }
    },

    createForm: (_req, res) => {
        res.render('products/productAdd', { title: 'Crear Nuevo Producto' });
    },

    productDetail: (req, res, next) => {
        try {
            const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
            const product = products.find(p => p.id === parseInt(req.params.id));
            if (!product) {
                return res.status(404).render('error', { message: 'Producto no encontrado' });
            }
            res.render('products/productDetail', { title: 'Detalle del Producto', product });
        } catch (error) {
            next(error);
        }
    },

    store: (req, res, next) => {
        try {
            const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
            const newProduct = {
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                direccion: req.body.direccion,
                barrio: req.body.barrio,
                zona: req.body.zona,
                ambientes: parseInt(req.body.ambientes) || 0,
                precio: parseFloat(req.body.precio) || 0,
                tipo: req.body.tipo,
                foto: req.body.foto || '/images/default.jpg',
                m2: parseInt(req.body.m2) || 0
            };
            products.push(newProduct);
            fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
            res.redirect('/inmuebles/products');
        } catch (error) {
            next(error);
        }
    },

    editForm: (req, res, next) => {
        try {
            const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
            const product = products.find(p => p.id === parseInt(req.params.id));
            if (!product) {
                return res.status(404).render('error', { message: 'Producto no encontrado' });
            }
            res.render('products/productEdit', { title: 'Editar Producto', product });
        } catch (error) {
            next(error);
        }
    },

    update: (req, res, next) => {
        try {
            const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
            const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
            if (productIndex === -1) {
                return res.status(404).render('error', { message: 'Producto no encontrado' });
            }
            products[productIndex] = {
                ...products[productIndex],
                direccion: req.body.direccion,
                barrio: req.body.barrio,
                zona: req.body.zona,
                ambientes: parseInt(req.body.ambientes) || products[productIndex].ambientes,
                precio: parseFloat(req.body.precio) || products[productIndex].precio,
                tipo: req.body.tipo,
                foto: req.body.foto || products[productIndex].foto,
                m2: parseInt(req.body.m2) || products[productIndex].m2
            };
            fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
            res.redirect('/inmuebles/products');
        } catch (error) {
            next(error);
        }
    },

    destroy: (req, res, next) => {
        try {
            const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
            const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
            
            if (productIndex === -1) {
                return res.status(404).render('error', { message: 'Producto no encontrado' });
            }

            products.splice(productIndex, 1);
            fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));
            res.redirect('/inmuebles/products');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = productsController;