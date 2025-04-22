const express = require('express');
const router = express.Router();
const { 
  showAddForm, 
  showEditForm, 
  listProperties,
  store,
  update,
  destroy
} = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../../middlewares/roleMiddleware');
const propertyValidator = require('../../validations/propertyValidator');
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
router.get('/products/create', isAuthenticated, isAdmin, showAddForm);

// Procesar la adición de una propiedad
router.post('/products', isAuthenticated, isAdmin, upload.single('foto'), propertyValidator, store);

// Formulario para editar una propiedad
router.get('/products/:id/edit', isAuthenticated, isAdmin, showEditForm);

// Procesar la edición de una propiedad
router.put('/products/:id', isAuthenticated, isAdmin, upload.single('foto'), propertyValidator, update);

// Eliminar una propiedad
router.delete('/products/:id', isAuthenticated, isAdmin, destroy);

module.exports = router;