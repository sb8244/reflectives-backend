'use strict';
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(process.env.SMTP_TRANSPORTER);
const appUrl = process.env.APPLICATION_BASE_URL;

module.exports = function sendMail(tokenToSend, uidToSend, recipient, callback) {
  let url = `${appUrl}#/auth?token=${tokenToSend}&uid=${uidToSend}`;
  var mailOptions = {
      from: '"Reflectives" <noreply@reflectives.com>',
      to: recipient,
      subject: 'Your Reflectives Login Link', // Subject line
      text: `You can login to reflectives at ${url}`,
      html: `
        <div>
          You can login to reflectives by clicking <a href="${url}">this link.</a>
        </div>
        `
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, callback);
};
