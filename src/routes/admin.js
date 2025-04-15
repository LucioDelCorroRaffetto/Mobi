const express = require('express');
const router = express.Router();
const { 
  showAddForm, 
  showEditForm, 
  addProperty, 
  updateProperty,
  listProperties,
  deleteProperty
} = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Listar todas las propiedades
router.get('/', isAuthenticated, isAdmin, listProperties);

// Formulario para agregar una propiedad
router.get('/add', isAuthenticated, isAdmin, showAddForm);

// Procesar la adición de una propiedad
router.post('/add', isAuthenticated, isAdmin, upload.single('foto'), addProperty);

// Formulario para editar una propiedad
router.get('/edit/:id', isAuthenticated, isAdmin, showEditForm);

// Procesar la edición de una propiedad
router.post('/edit/:id', isAuthenticated, isAdmin, upload.single('foto'), updateProperty);

// Eliminar una propiedad
router.delete('/delete/:id', isAuthenticated, isAdmin, deleteProperty);

module.exports = router;