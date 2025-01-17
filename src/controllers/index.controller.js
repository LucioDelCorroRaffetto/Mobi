const express = require('express');
const router = express.Router();

// Manejo de errores 404
router.use((req, res) => {
    res.status(404).render('error', { title: 'Error 404', message: 'Página no encontrada' });
});

module.exports = router;