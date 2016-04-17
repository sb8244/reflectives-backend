'use strict';

module.exports = function(transporter, reminder, reflections) {
  return new Promise((resolve, reject) => {
    var mailOptions = {
        from: '"Reflectives" <noreply@reflectives.com>',
        to: reminder.user.get('email'),
        subject: 'Your Reflectives Follow Up',
        html: `
          <html>
            <body>
              <p>There are cool reflectives to follow up on.
            </body>
          </html>
        `
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
