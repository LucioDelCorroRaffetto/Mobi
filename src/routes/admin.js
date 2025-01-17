const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data/data.json');
const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Guardar productos en el archivo JSON
const saveProducts = () => {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
};

// Formulario para agregar un producto
router.get('/add', (req, res) => {
  res.render('products/productAdd');
});

// Formulario para editar un producto  
router.get('/edit/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }
  res.render('products/productEdit', { product });
});

// Procesar la adición de un producto
router.post('/add', (req, res) => {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    direccion: req.body.direccion,
    barrio: req.body.barrio,
    zona: req.body.zona,
    ambientes: parseInt(req.body.ambientes) || 0,
    precio: parseFloat(req.body.precio) || 0,
    tipo: req.body.tipo,
    foto: req.body.foto,
    m2: parseInt(req.body.m2) || 0,
  };

  products.push(newProduct);
  saveProducts();
  console.log('Producto agregado:', newProduct);
  res.redirect('/admin');
});

// Procesar la edición de un producto
router.post('/edit/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex >= 0) {
    const updatedProduct = {
      id: parseInt(req.params.id),
      direccion: req.body.direccion,
      barrio: req.body.barrio,
      zona: req.body.zona,
      ambientes: parseInt(req.body.ambientes) || 0,
      precio: parseFloat(req.body.precio) || 0,
      tipo: req.body.tipo,
      foto: req.body.foto,
      m2: parseInt(req.body.m2) || 0,
    };
    products[productIndex] = updatedProduct;
    saveProducts();
    console.log('Producto actualizado:', updatedProduct);
  } else {
    console.error('Producto no encontrado:', req.params.id);
    return res.status(404).send('Producto no encontrado');
  }
  res.redirect('/admin');
});

module.exports = router;