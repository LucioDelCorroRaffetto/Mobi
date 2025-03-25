const express = require('express');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data/products.json');
const { Producto, Usuario } = require('../../database/models');

let products;
try {
  products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
} catch (error) {
  console.error('Error al leer el archivo de productos:', error);
  products = [];
}

// Guardar productos en el archivo JSON
const saveProducts = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error al guardar los productos:', error);
    throw error;
  }
};

const adminController = {
  // Formulario para agregar un producto
  showAddForm: async (req, res) => {
    try {
      const agentes = await Usuario.findAll({
        where: { tipo: 'agente', activo: true }
      });
      res.render('products/productAdd', { agentes });
    } catch (error) {
      console.error('Error al mostrar el formulario de agregar:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Formulario para editar un producto  
  showEditForm: async (req, res) => {
    try {
      const producto = await Producto.findByPk(req.params.id);
      if (!producto) {
        return res.status(404).send('Producto no encontrado');
      }
      const agentes = await Usuario.findAll({
        where: { tipo: 'agente', activo: true }
      });
      res.render('products/productEdit', { producto, agentes });
    } catch (error) {
      console.error('Error al mostrar el formulario de edición:', error);
      res.status(500).send('Error interno del servidor');
    }
  },

  // Procesar la adición de un producto
  addProduct: (req, res) => {
    try {
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
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      res.status(500).send('Error al agregar el producto');
    }
  },

  // Procesar la edición de un producto
  updateProduct: (req, res) => {
    try {
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
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).send('Error al actualizar el producto');
    }
  }
};

module.exports = adminController;