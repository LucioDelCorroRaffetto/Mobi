const express = require('express');
const router = express.Router();
const { 
    allProducts,
    createForm,
    productDetail, 
    store,
    editForm,
    update,
    destroy
} = require('../controllers/productsController');

// Listado de productos
router.get('/products', allProducts);

// Formulario de creación
router.get('/products/create', createForm);

// Detalle de producto
router.get('/products/:id', productDetail);

// Acción de creación
router.post('/products', store);

// Formulario de edición
router.get('/products/:id/edit', editForm);

// Acción de edición
router.put('/products/:id', update);

// Acción de borrado
router.delete('/products/:id', destroy);

module.exports = router;