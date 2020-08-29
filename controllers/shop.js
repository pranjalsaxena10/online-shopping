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

    Cart.getCart((cartData) => {
        const mapOfIdAndQty = new Map();
        console.log(cartData, '***');
        if (cartData.length === 0) {
            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart',
                productsInCart: [],
                totalPrice: 0
            });
            return;
        }
        cartData.products.forEach(cartDetail => {
            mapOfIdAndQty.set(cartDetail.id, cartDetail.qty);
        });

        Product.getAllProducts((products) => {
            const mapOfIdAndProduct = new Map();
            products.forEach(product => {
                mapOfIdAndProduct.set(product.id, product);
            });

            const cartProducts = [];
            mapOfIdAndQty.forEach((value, key) => {
                const product = mapOfIdAndProduct.get(key);
                if (product) {
                    cartProducts.push({
                        productData: product,
                        quantity: value
                    });
                } 
            });

            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart',
                productsInCart: cartProducts,
                totalPrice: cartData.totalPrice
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
  Product.getProductById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    const productPrice = req.body.price;
    Cart.deleteProduct(productId, productPrice);
    res.redirect('/cart');
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