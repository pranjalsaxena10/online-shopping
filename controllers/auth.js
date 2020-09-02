const User = require('../models/User');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', { 
        pageTitle: 'Login', 
        path: '/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    const userId = '5f4bdd1bb7a06738209c118a';
    User.findById(userId)
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(err => {
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
    
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log('Error Message while destroying session:: ', err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', { 
        pageTitle: 'Signup', 
        path: '/signup',
        isAuthenticated: false
    });
}