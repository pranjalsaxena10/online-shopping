const rootDirectory = require('../util/path');
const path = require('path');

const fs = require('fs');

const filePath = path.join(rootDirectory, 'data', 'cart.json');

class Cart {
     static addProduct(id, productPrice) {
         fs.readFile(filePath, (err, fileContent) => {

            let cart = { products: [], totalPrice: 0 };

            if(!err) {
                cart = JSON.parse(fileContent);
            }

            const existingProdIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProdIndex];
            let updatedProduct;

            if (existingProduct) {
            
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProdIndex] = updatedProduct;
            
            } else {
                updatedProduct = { id: id, qty: 1 };

                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice += +productPrice;
            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.log(err, 'Error');
            });
         });
     }

     static deleteProduct(productId, productPrice) {
         fs.readFile(filePath, (err, cart) => {
             if (err) {
                 return;
             }
             const cartContent = JSON.parse(cart);
             const index = cartContent.products.findIndex(product => product.id === productId);
             const productToBeRemoved = cartContent.products[index];
             const productQty = productToBeRemoved.qty;
             const updatedCart = {...cartContent};
             productPrice = +productPrice;
             if (productToBeRemoved) {
                updatedCart.products = updatedCart.products.filter(prod => prod.id !== productId);
                updatedCart.totalPrice -= productQty * productPrice;
                fs.writeFile(filePath, JSON.stringify(updatedCart), err => {
                    console.log(err, 'Error');
                });
             } 
         })
     }

     static getCart(callBack) {
        fs.readFile(filePath, (err, fileContent) => {
            if(err) {
                callBack([]);
            } else {
                callBack(JSON.parse(fileContent));
            }
        });
     }
}

module.exports = Cart;