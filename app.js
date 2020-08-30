const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');
const rootDir = require('./util/path');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const User = require('./models/User');

const app = express();
const uri = '';

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

app.use((req, res, next) => {
    User.findById('5f4bb5b98467b7224ceca2bf')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(uri)
    .then(() => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Pranjal',
                        email: 'pranjalmohansaxena@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    return user.save();
                }
            })
            .then(response => {
                app.listen(3000, () => {
                    console.log('Server started successfully at port: 3000');
                });
            })
    })
    .catch(err => console.log(err));





