const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((response) => {
            res.render('shop/product-list', { 
                pageTitle: 'All Products', 
                products: response,
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
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
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((result) => {
            res.render('shop/index', { 
                pageTitle: 'Index', 
                products: result,
                path: '/',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));

};

exports.getCart = (req, res, next) => {
    req.session.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const cartItems = user.cart.items;
            let totalCartValue = 0;
            cartItems.forEach(cartItem => {
                totalCartValue += cartItem.productId.price * cartItem.quantity;
            });
            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart',
                productsInCart: cartItems,
                totalPrice: totalCartValue,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findById(prodId)
        .then(product => {
            return req.session.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    
};

exports.deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    const deleteAll = JSON.parse(req.body.deleteAll);
    req.session.user.deleteProductFromCart(productId, deleteAll)
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
    
};

exports.postOrder = (req, res, next) => {
    req.session.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            let totalPrice = 0;
            const cartItems = user.cart.items.map(cartItem => {
                totalPrice += cartItem.quantity * cartItem.productId.price;
                return {
                    quantity: cartItem.quantity,
                    product: { ...cartItem.productId._doc }
                }
            });

            const order = new Order({
                user: {
                    name: req.session.user.name,
                    userId: req.session.user._id
                },
                products: cartItems,
                totalOrderValue: totalPrice
            });

            return order.save();
        })
        .then(response => {
            return req.session.user.clearCart();
        })
        .then(response => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
    
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.session.user._id })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders', 
                path: '/orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// };