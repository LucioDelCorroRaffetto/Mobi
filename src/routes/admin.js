const express = require('express');
const router = express.Router();
const { showAddForm, showEditForm, addProduct, updateProduct} = require('../controllers/adminController');

// Formulario para agregar un producto
router.get('/add', showAddForm);

// Formulario para editar un producto  
router.get('/edit/:id', showEditForm);

// Procesar la adición de un producto
router.post('/add', addProduct  );

// Procesar la edición de un producto
router.post('/edit/:id', updateProduct);

module.exports = router;