const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const MongoDbSessionStore = require('connect-mongodb-session')(session);

const path = require('path');
const rootDir = require('./util/path');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/User');

const app = express();

const MONGODB_URI = '';

const sessionStore = new MongoDbSessionStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(session({ 
    secret: 'rewhruidhkjfadskjgfhkdgfhakddfbdhjhagfhjdagfkhjgdaffriufrew', 
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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





