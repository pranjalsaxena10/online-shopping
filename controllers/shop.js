const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((response) => {
            res.render('shop/product-list', { 
                pageTitle: 'All Products', 
                products: response,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
    
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
        .then((response) => {
            res.render('shop/product-detail', { 
                pageTitle: response.title, 
                product: response,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((result) => {
            res.render('shop/index', { 
                pageTitle: 'Index', 
                products: result,
                path: '/'
            });
        })
        .catch(err => console.log(err));

};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            let cartTotalPrice = 0;
            products.forEach(product => {
                cartTotalPrice += product.price * product.cartItem.quantity;
            });
            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart',
                productsInCart: products,
                totalPrice: cartTotalPrice
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    let cartValue;
    const prodId = req.body.productId;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            cartValue = cart;
            return cart.getProducts({ where: {id: prodId} });
        })
        .then(products => {
            
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                newQuantity = product.cartItem.quantity + 1;
                return product;
            }
            return Product.findByPk(prodId);

        })
        .then(product => {
            return cartValue.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
};

exports.deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where : { id: productId } })
        })
        .then(products => {
            if (products.length > 0) {
                return products[0].cartItem.destroy();
            }

            throw new Error('No Product with given productId:: ', productId, 'are found');
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
    
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders', 
        path: '/orders'
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};