'use strict';

module.exports = function(transporter, reminder) {
  return new Promise((resolve, reject) => {
    var mailOptions = {
        from: '"Reflectives" <noreply@reflectives.com>',
        subject: 'Your Reflectives Follow Up'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(err) {
      if (err) {
        return reject();
      }
      resolve();
    });
  });
};
