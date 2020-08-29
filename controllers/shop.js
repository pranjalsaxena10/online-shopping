const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.getProducts = (req, res, next) => {
    Product.getAllProducts((products ) => {

        console.log('Products Data', products);
        res.render('shop/product-list', { 
            pageTitle: 'All Products', 
            products: products,
            path: '/products'
        });
    });
    // Product.getProductsFromDB()
    //     .then(([rows, fieldData]) => {
    //         res.render('shop/product-list', { 
    //             pageTitle: 'All Products', 
    //             products: rows,
    //             path: '/products'
    //         });
    //     })
    //     .catch(err => console.log('Error while fetching data from Database:: ', err));
    
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    console.log('ProductId :: ', productId, typeof(productId));
    Product.getProductById(productId, (response) => {
        console.log('Product with id as :: ', productId, ' is :: ', response);
        res.render('shop/product-detail', { 
            pageTitle: response.title, 
            product: response,
            path: '/products'
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.getAllProducts((products) => {

        console.log('Products Data', products);
        res.render('shop/index', { 
            pageTitle: 'Index', 
            products: products,
            path: '/'
        });
    });

    // Product.getProductsFromDB()
    //     .then(([rows]) => {
    //         res.render('shop/index', { 
    //             pageTitle: 'Index', 
    //             products: rows,
    //             path: '/'
    //         });
    //     })
    //     .catch(err => console.log('Error while fetching data from Database:: ', err));
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