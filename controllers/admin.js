const Product = require('../models/Product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    /**
     * req.user is a Sequelize object stored while executing app.js
     * Sequelize provides helper methods by itself when we create associations on tables
     * createProduct is an example of such
     */

    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
    })
    .then((response) => {
        res.redirect('/admin/products');  
    })
    .catch(err => console.log(err));

    // Product.create({
    //     title: title,
    //     imageUrl: imageUrl,
    //     price: price,
    //     description: description

    // }).then((response) => {
    //     res.redirect('/admin/products');  
    // }).catch(err => console.log(err));

};

exports.postEditProduct = (req, res, next) => {
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const productId = req.body.id;

    Product.findByPk(productId)
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.title = updatedTitle;
            return product.save();

        })
        .then(response => {
            console.log('Updation successful with message from Db as :: ', response);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    
};

exports.getEditProduct = (req, res, next) => {
    const editMode = JSON.parse(req.query.edit);
    console.log(editMode, 'editMode', typeof(editMode));
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    if (productId) {

        req.user.getProducts({ where: { id: productId } })
        // Product.findByPk(productId)
            .then((products) => {
                const product = products[0];
                if (!product) {
                    return res.redirect('/');
                }
    
                res.render('admin/edit-product', { 
                    pageTitle: 'Edit Product',
                    path: '/admin/edit-product',
                    editing: editMode,
                    productData: product
                });
            })
            .catch(err => console.log(err));
    }
    
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
    // Product.findAll()
        .then((response) => {
            res.render('admin/products', { 
                pageTitle: 'Admin Products', 
                products: response,
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    const productId = req.body.id;
    Product.findByPk(productId)
    .then(product => {
        return product.destroy();
    })
    .then(response => {
        console.log('Deletion successful with response from Sequelize:: ', response);
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
    
}