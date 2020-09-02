const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', { 
        pageTitle: 'Login', 
        path: '/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let userLoggedIn;
    User.findOne({ email: email})
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }
            userLoggedIn = user;
            return bcrypt.compare(password, user.password);      
        })
        .then(doMatch => {
            if (doMatch) {
                req.session.user = userLoggedIn;
                req.session.isLoggedIn = true;
                return req.session.save(err => {
                    if (err) {
                        console.log('Error message while saving session is:: ', err);
                    }
                    res.redirect('/');
                });
            }
            res.redirect('/login');
        })
        .catch(err => console.log(err));
    
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error message while saving session is:: ', err);
        }
        res.redirect('/login');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', { 
        pageTitle: 'Signup', 
        path: '/signup',
        isAuthenticated: false
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const name = req.body.name;
    User.findOne({ email: email })
        .then(userData => {
            if (userData) {
                return res.redirect('/signup');
            }
            const salt = 12;
            return bcrypt.hash(password, salt)
                    .then(hashedPassword => {
                        const user = new User({
                            email: email,
                            name: name,
                            password: hashedPassword,
                            cart: { items: [] }
                        });
                        return user.save();
                    })
                    .then(response => res.redirect('/login'))
        })
        .catch(err => console.log(err));
}