const Product = require('../models/Product');


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.session.user._id
    });

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
    Product.findById(productId)
        .then(product => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDescription;
            return product.save();
        })
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
                    productData: product,
                    isAuthenticated: req.session.isLoggedIn
                });
            })
            .catch(err => console.log(err));
    }
    
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((response) => {
            console.log(response)
            res.render('admin/products', { 
                pageTitle: 'Admin Products', 
                products: response,
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    const productId = req.body.id;
    Product.findByIdAndRemove(productId)
        .then(response => {
            console.log('Deletion Successful with response as :: ', response);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    
}