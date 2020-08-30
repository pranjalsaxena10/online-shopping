const mongoDb = require('mongodb');
const ObjectID = mongoDb.ObjectID;
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this);
    }

    addToCart(product) {
        let updatedQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        const productInCartIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.toString() === product._id.toString();
        });

        if (productInCartIndex >= 0) {
            updatedQuantity = this.cart.items[productInCartIndex].quantity + 1;
            updatedCartItems[productInCartIndex].quantity = updatedQuantity; 
        } else {
            updatedCartItems.push({ productId: new ObjectID(product._id), quantity: updatedQuantity });
        }

        const updatedCart = {
            items: updatedCartItems
        };

        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectID(this._id)}, 
            { $set: { cart: updatedCart } 
        });
    }

    getCart() {
        const quantityMap = new Map(this.cart.items.map(items => [ items.productId.toString(), items.quantity ]));
        const productIdsInCart = this.cart.items.map(cartItem => {
            return cartItem.productId;
        })
        const db = getDb();

        return db.collection('products')
            .find({ _id: { $in: productIdsInCart } })
            .toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: quantityMap.get(product._id.toString())
                    }
                })
            })
            .then(cartItems => {
                let totalPrice = 0;
                cartItems.forEach(cartItem => {
                    totalPrice += +cartItem.price * cartItem.quantity;
                });
                return {
                    productsInCart: cartItems,
                    totalCartValue: totalPrice
                }
            })
            .catch(err => console.log(err));
    }

    deleteProductFromCart(productId, deleteAll) {
        let updatedCartItems;
        const productInCartIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.toString() === productId.toString();
        });

        if (deleteAll || (!deleteAll && this.cart.items[productInCartIndex].quantity === 1)) {
            updatedCartItems = this.cart.items.filter(product => product.productId.toString() !== productId);

        } else {
            updatedCartItems = [...this.cart.items];

            if (productInCartIndex >= 0) {
                updatedCartItems[productInCartIndex].quantity = this.cart.items[productInCartIndex].quantity - 1; 

            } else {
                throw 'Product is not available in cart';
            }
        }

        const updatedCart = {
            items: updatedCartItems
        };
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectID(this._id)}, 
            { $set: { cart: updatedCart } 
        });
    }
    
    static fetchAll() {
        const db = getDb();
        return db.collection('users').find().toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectID(userId) });
    }

    static deleteById(userId) {
        const db = getDb();
        return db.collection('users').deleteOne({ _id: new ObjectID(userId) });
    }
}

module.exports = User;