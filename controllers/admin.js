const Product = require('../models/Product');
const mongoDb = require('mongodb');
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
    const product = new Product(title, price, imageUrl, description);

    product.save()
        .then((response) => {
            console.log('product created with response as :: ', response);
            res.redirect('/admin/products');  
        })
        .catch(err => console.log(err));

};

exports.postEditProduct = (req, res, next) => {
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const productId = req.body.id;
    const objectId = new mongoDb.ObjectID(productId);
    const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDescription, objectId);
    
    product.save()
        .then(response => {
            console.log('product updated with response as :: ', response);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    
};

exports.getEditProduct = (req, res, next) => {
    const editMode = JSON.parse(req.query.edit);
    if (!editMode) {
        return res.redirect('/');
    }
    const productId = req.params.productId;
    if (productId) {

        Product.findById(productId)
            .then((product) => {
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
    Product.fetchAll()
        .then((response) => {
            console.log(response)
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
    Product.deleteById(productId)
    .then(response => {
        console.log('Deletion Successful with response as :: ', response);
        res.redirect('/admin/products');
    })
    .then(() => {
        
    })
    .catch(err => console.log(err));
    
}