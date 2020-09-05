const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const nodemailer = require('nodemailer');
const configProperties = require('../configs/config.json');

const oauth2Client = new OAuth2(configProperties.clientID, configProperties.clientSecret, configProperties.redirectUrl);

oauth2Client.setCredentials({ refresh_token: configProperties.refreshToken });

async function getSMTPTransport() {
    try {
        const accessTokenValue = await (await oauth2Client.getAccessToken()).token;
        const smtpTransport = nodemailer.createTransport({
            service: configProperties.service,
            auth: {
                type: 'oauth2',
                user: configProperties.fromEmailAddress,
                clientID: configProperties.clientID,
                clientSecret: configProperties.clientSecret,
                refreshToken: configProperties.refreshToken,
                accessToken: accessTokenValue
            }
        });
        return smtpTransport;

    } catch (error) {
        console.log('Error occurred while getting Access token with error as :: ', error);
    }
}


async function sendMail(email) {
    const successCode = 200;
    try {
        const mailOptions = {
            from: configProperties.fromEmailAddress,
            to: email,
            subject: 'Signup Succeded',
            html: '<h1>Signup Successful</h1>' 
        };
        const smtpTransport = await getSMTPTransport();
        smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
        });
        
        return successCode;

    } catch (error) {
        console.log('Error occurred while sending mail with error as :: ', error);
    }
}
module.exports.sendMail = sendMail;