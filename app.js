const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const path = require('path');
const rootDir = require('./util/path');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// const User = require('./models/User');

const app = express();
const uri = '';

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

// app.use((req, res, next) => {
//     User.findById('5f4b3ca0acd764f57b10420c')
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => console.log(err));
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(uri)
    .then(() => {
        app.listen(3000, () => {
            console.log('Server started successfully at port: 3000');
        });
    })
    .catch(err => console.log(err));





