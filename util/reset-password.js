const crypto = require('crypto');
const mailSender = require('./mailSender');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

async function resetPasswordSendMail(emailAddress) {
    try {
        const tokenForResetPassword = crypto.randomBytes(64).toString('hex');
        const user = await User.findOne({ email: emailAddress });
        if (!user) {
            const errorStatusCode = 500;
            return errorStatusCode;
        }
        user.resetPassToken = tokenForResetPassword;
        const expirationTime = 1800000;
        user.resetPassTokenExpirationDate = Date.now() + expirationTime;

        const response = await user.save();

        const emailSubject = 'Reset Password';
        const resetPasswordMailContent = `
                <p>
                    Click this link to reset your password 
                    <a href="http://localhost:3000/new-password-form/${tokenForResetPassword}">Reset Password Link</a>
                    
                </p>
            `;
        const resetPasswordEmail = {
            subject: emailSubject,
            content: resetPasswordMailContent
        }
        const statusCode = await mailSender.sendMail(emailAddress, resetPasswordEmail);
        return statusCode;

    } catch (error) {
        console.log('Error occurred while resetting password with error as:: ', error);   
    }

}

async function validateToken(tokenForResetPassword) {
    try {
        const user = await User.findOne({ 
            resetPassToken: tokenForResetPassword,
            resetPassTokenExpirationDate: { $gt: Date.now() }
        });
        return user;
    } catch (error) {
        console.log('Error occurred while getting user with provided access token having error as:: ', error);
    }
}

async function updatePassword(tokenForResetPassword, userId, newPassword) {
    try {
        const user = await User.findOne({ 
            _id: userId,
            resetPassToken: tokenForResetPassword,
            resetPassTokenExpirationDate: { $gt: Date.now() }
        });
        console.log(user);
        if (!user) {
            return 'User Not Found';
        }
        const salt = 12;
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.resetPassToken = undefined;
        user.resetPassTokenExpirationDate = undefined;
        return user.save();

    } catch (error) {
        console.log('Error occurred while getting user with provided access token having error as:: ', error);
    }
}

async function sendMailAfterResetSuccess(userId) {
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return 'User Not Found';
        }
        const emailSubject = 'Password updation successful';
        const updatePasswordSuccessMailContent = `
                <p>
                    Hi ${user.name}, there is an update regarding your account. Password is updated successfully.
                </p>
            `;
        const updatePasswordSuccessMail = {
            subject: emailSubject,
            content: updatePasswordSuccessMailContent
        }
        const statusCode = await mailSender.sendMail(user.email, updatePasswordSuccessMail);
        return statusCode;

    } catch (error) {
        console.log('Error occurred while resetting password with error as:: ', error);   
    }

}

module.exports.resetPasswordSendMail = resetPasswordSendMail;
module.exports.validateToken = validateToken;
module.exports.updatePassword = updatePassword;
module.exports.sendMailAfterResetSuccess = sendMailAfterResetSuccess;