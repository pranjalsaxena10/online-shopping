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
    const id = Math.random().toString();
    const product = new Product(id, title, imageUrl, description, price);
    product.save();
    // product.insertProductToDB()
    //     .then(() => {
    //         res.redirect('/admin/products');
    //     })
    //     .catch(err => console.log('Error while inserting ', product, ' to products table with error message as:: ', err));
};

exports.postEditProduct = (req, res, next) => {
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const productId = req.body.id;
    const updatedProduct = new Product(productId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);

    updatedProduct.update(productId);
    res.redirect('/admin/products');
};

exports.getEditProduct = (req, res, next) => {

    const editMode = JSON.parse(req.query.edit);
    console.log(editMode, 'editMode', typeof(editMode));
    if (!editMode) {
        return res.redirect('/');
    }

    const productId = req.params.productId;
    if (productId) {

        Product.getProductById(productId, product =>{
            if (!product) {
                return res.redirect('/');
            }

            res.render('admin/edit-product', { 
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                productData: product
            });
        });
    }
    
};

exports.getProducts = (req, res, next) => {
    Product.getAllProducts((products) => {

        console.log('Products Data', products);
        res.render('admin/products', { 
            pageTitle: 'Admin Products', 
            products: products,
            path: '/admin/products'
        });
    });

    // Product.getProductsFromDB()
    //     .then(([rows]) => {
    //         res.render('admin/products', { 
    //             pageTitle: 'Admin Products', 
    //             products: rows,
    //             path: '/admin/products'
    //         });
    //     })
    //     .catch(err => console.log('Error while fetching data from Database:: ', err));
};

exports.deleteProduct = (req, res, next) => {
    const productId = req.body.id;
    Product.delete(productId, (response) => {
        console.log(response);
    });
    res.redirect('/admin/products');
}