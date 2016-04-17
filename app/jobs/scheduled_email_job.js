'use strict';

const db = require('app/models');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(process.env.SMTP_TRANSPORTER);
const sendReminder = require('app/email/reminder');
const co = require('co');

module.exports = {
  transporter: transporter,
  call: co.wrap(function*() {
    const reminders = yield db.reminder.findAll({
      where: {
        status: 'pending',
        sendAt: {
          $lte: new Date()
        }
      },
      include: [ db.user, db.reflectionCollection ]
    });

    yield reminders.map(function*(reminder) {
      let reflections = yield reminder.reflectionCollection.getReflections();
      return sendReminder(transporter, reminder, reflections);
    });
  })
};
