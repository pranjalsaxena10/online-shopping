const Cart = require('../models/Cart');
const rootDirectory = require('../util/path');
const path = require('path');
const db = require('../util/database');

const fs = require('fs');

const filePath = path.join(rootDirectory, 'data', 'products.json');

const getAllProductsFromFileStorage = callBack => {
    
    fs.readFile(filePath, (err, fileContent) => {
        if(err) {
            callBack([]);
        } else {
            callBack(JSON.parse(fileContent));
        }
    });
}


const writeProductDataInFile = (productsContent, callBack) => {

    fs.writeFile(filePath, JSON.stringify(productsContent), err => {
        callBack(err);
    });
}

class Product {
    
    constructor(id, titleOfBook, imageUrl, description, price) {
        this.id = id;
        this.title = titleOfBook;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getAllProductsFromFileStorage(products => {
            products.push(this);
            writeProductDataInFile(products, (err) => {
                console.log('Error while writing', err);
            });
        });
    }

    update(productId) {
        getAllProductsFromFileStorage(products => {
            
            // index var stores position of product to be updated 
            const index = products.findIndex(product => product.id === productId);

            let updatedProductsList = [...products];
            updatedProductsList[index] = this;
            writeProductDataInFile(updatedProductsList, (err) => {
                console.log('Error while writing', err);
            });

        });
    }

    static delete(productId, response) {
        getAllProductsFromFileStorage(products => {
            const productToBeDeleted = products.find(product => product.id === productId);
            products = products.filter(prod => !(prod.id === productId));
            writeProductDataInFile(products, (err) => {
                if (!err) {
                    Cart.deleteProduct(productId, productToBeDeleted.price);
                    response('Deletion Success');
                }
                response('Deletion Failed with error message as:: ', err);
            });
        });
    }

    static getAllProducts(callBack) {
        getAllProductsFromFileStorage(callBack);
    }

    static getProductById(productId, response) {
        getAllProductsFromFileStorage(products => {
            const product = products.find(p => p.id === productId);
            response(product);
        });
    }

    static getProductsFromDB() {
        const fetchQuery = 'SELECT * FROM products';
        return db.execute(fetchQuery);
    }

    insertProductToDB() {
        const insertQuery = 'INSERT INTO products(title, description, price, imageUrl) VALUES (?, ?, ?, ?)';
        return db.execute(insertQuery, [this.title, this.description, this.price, this.imageUrl]);
    }
}

module.exports = Product;