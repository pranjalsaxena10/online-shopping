const express = require('express');

const bodyParser = require('body-parser');

const path = require('path');
const rootDir = require('./util/path');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const sequelize = require('./util/database');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const CartItem = require('./models/cart-item');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

/**
 * This code defines associations 
 */

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
    .sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if(!user) {
            return User.create({
                name: 'Pranjal',
                email: 'pranjalmohansaxena@gmail.com'
            });
        }
        return user;
    })
    .then(user => {
        return user.createCart();  
    })
    .then(cart => {
        app.listen(3000, () => {
            console.log('Server started successfully at port: 3000 and user as', cart);
        });
    })
    .catch(error => console.log(error));

