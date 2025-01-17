const fs = require('fs');

const cartController = {
    loadCart: (req, res) => {
        const products = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));
        res.render('products/productCart', { 
            title: 'Carrito de Compras', 
            cartItems: products, // Cambié products a cartItems
            subtotal: calculateSubtotal(products),
            taxes: calculateTaxes(products),
            total: calculateTotal(products)
        });
    },

    removeItem: (req, res) => {
        const id = parseInt(req.params.id, 10);
        let products = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));

        products = products.filter(product => product.id !== id);
        fs.writeFileSync('./data/data.json', JSON.stringify(products, null, 2));

        res.redirect('/productCart'); // Redirige de nuevo al carrito después de eliminar el producto
    }
};

function calculateSubtotal(products) {
    return products.reduce((sum, product) => sum + product.precio, 0);
}

function calculateTaxes(products) {
    const subtotal = calculateSubtotal(products);
    return subtotal * 0.15;
}

function calculateTotal(products) {
    const subtotal = calculateSubtotal(products);
    const taxes = calculateTaxes(products);
    return subtotal + taxes;
}

module.exports = cartController;