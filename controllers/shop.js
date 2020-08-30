const Product = require('../models/Product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
    console.log(productId, typeof(productId));
    Product.findById(productId)
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
    Product.fetchAll()
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
            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart',
                productsInCart: cart.productsInCart,
                totalPrice: cart.totalCartValue
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    
};

// exports.deleteCartItem = (req, res, next) => {
//     const productId = req.body.productId;
//     const deleteAll = JSON.parse(req.body.deleteAll);
//     let cartDetails; 
//     req.user.getCart()
//         .then(cart => {
//             cartDetails = cart;
//             return cart.getProducts({ where : { id: productId } })
//         })
//         .then(products => {
//             if (products.length > 0) {
//                 if(deleteAll) {
//                     return products[0].cartItem.destroy();
//                 }
//                 products[0].cartItem.quantity -= 1;
//                 if(products[0].cartItem.quantity > 0) {
//                     return products[0].cartItem.save();
//                 }
//                 return products[0].cartItem.destroy();
//             }

//             throw new Error('No Product with given productId:: ', productId, 'are found');
//         })
//         .then(() => res.redirect('/cart'))
//         .catch(err => console.log(err));
    
// };

// exports.getOrders = (req, res, next) => {
//     res.render('shop/orders', {
//         pageTitle: 'Your Orders', 
//         path: '/orders'
//     });
// };

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };