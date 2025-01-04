const fs = require('fs');

const productsController = {
    all: (req, res, next) => {
        const inmueble = req.params.inmueble;
        const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));
        const resultadoInmueble = products.filter(product => product.inmueble === inmueble);
        resultadoInmueble.length > 0 ? res.render('products', { title: 'Lista de Productos', resultadoInmueble }) : res.render('products', { title: 'Error', message: 'Producto no encontrado', products });
    },
    allProducts: (req, res, next) => {
        const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));
        res.render('products', { title: 'Lista de Todos los Productos', resultadoInmueble: products });
    }
};

module.exports = productsController;