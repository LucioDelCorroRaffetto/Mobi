const express = require('express');
const router = express.Router();
const { all, allProducts } = require('../controllers/productsController');

router.get('/', all);
router.get('/products', allProducts);

module.exports = router;