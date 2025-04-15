const fs = require('fs');

const cartController = {
    loadCart: (req, res) => {
        try {
            const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
            res.render('products/productCart', { 
                title: 'Carrito de Compras', 
                cartItems: products,
                subtotal: calculateSubtotal(products),
                taxes: calculateTaxes(products),
                total: calculateTotal(products)
            });
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            res.render('products/productCart', { 
                title: 'Carrito de Compras', 
                cartItems: [],
                subtotal: 0,
                taxes: 0,
                total: 0,
                error: 'No se pudo cargar el carrito'
            });
        }
    },

    removeItem: (req, res) => {
        try {
            const id = parseInt(req.params.id, 10);
            let products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

            products = products.filter(product => product.id !== id);
            fs.writeFileSync('./data/products.json', JSON.stringify(products, null, 2));

            res.redirect('/productCart');
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            res.redirect('/productCart?error=No se pudo eliminar el producto');
        }
    }
};

function calculateSubtotal(products) {
    return products.reduce((sum, product) => sum + (product.precio || 0), 0);
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