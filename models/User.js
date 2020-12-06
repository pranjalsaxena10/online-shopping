const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    resetPassToken: String,
    resetPassTokenExpirationDate: Date
});

userSchema.methods.addToCart = function(product) {
    let updatedQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    const productInCartIndex = this.cart.items.findIndex(cartProduct => {
        return cartProduct.productId.toString() === product._id.toString();
    });

    if (productInCartIndex >= 0) {
        updatedQuantity = this.cart.items[productInCartIndex].quantity + 1;
        updatedCartItems[productInCartIndex].quantity = updatedQuantity; 
    } else {
        updatedCartItems.push({ productId: product._id, quantity: updatedQuantity });
    }

    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteProductFromCart = function(productId, deleteAll) {
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

    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);