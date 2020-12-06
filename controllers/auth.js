const User = require('../models/User');
const bcrypt = require('bcryptjs');

const mailSender = require('../util/mailSender');
const resetPasswordUtil = require('../util/reset-password');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', { 
        pageTitle: 'Login', 
        path: '/login',
        isAuthenticated: false,
        errorMessage: message
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
            req.flash('error', 'Invalid email or password.');
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
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', { 
        pageTitle: 'Signup', 
        path: '/signup',
        isAuthenticated: false,
        errorMessage: message
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
                req.flash(
                    'error',
                    'E-Mail exists already, please pick a different one.'
                  );
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
                    .then(response => { 
                        const emailContent = {
                            subject: 'Signup Succeded',
                            content: '<h1>Signup Successful</h1>'
                        }
                        mailSender.sendMail(email, emailContent)
                            .then(statusCode => {
                                if (statusCode === 200) {
                                    return res.redirect('/login');
                                }
                            })
                            .catch(err => console.log(err));
                    });
        })
        .catch(err => console.log(err));
}

exports.getResetPassword = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    
    res.render('auth/reset-password', { 
        pageTitle: 'Reset-Password', 
        path: '/reset-password',
        isAuthenticated: false,
        errorMessage: message
    });   
}

exports.postResetPassword = (req, res, next) => {
    resetPasswordUtil.resetPasswordSendMail(req.body.email)
        .then(responseStatusCode => {
            if (responseStatusCode != 200) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset-password');
            } else {
                return res.redirect('/login');
            }
        })
        .catch(err => console.log(err)); 
}

exports.getNewPasswordForm = (req, res, next) => {
    
    const errorMessageFromUtil = 'Invalid Token';

    resetPasswordUtil.validateToken(req.params.token)
        .then(user => {
            if (!user) {
                req.flash('error', errorMessageFromUtil);
                return res.redirect('/login');
            }
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password-form', { 
                pageTitle: 'Update-Password', 
                path: '/new-password-form',
                isAuthenticated: false,
                userId: user._id.toString(),
                passwordToken: req.params.token,
                errorMessage: message
            }); 
        })
        .catch(err => console.log(err));
}

exports.updatePassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    resetPasswordUtil.updatePassword(passwordToken, userId, newPassword)
        .then(response => {
            if (response === 'User Not Found') {
                req.flash('error', 'Cannot update password');
            }
            return resetPasswordUtil.sendMailAfterResetSuccess(userId);
        })
        .then(response => {
            if (response === 200) {
                return res.redirect('/login');
            }
        })
        .catch(err => console.log(err));
}
