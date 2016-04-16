'use strict';

const db = require('app/models');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(process.env.SMTP_TRANSPORTER);
const sendReminder = require('app/email/reminder');

class ScheduledEmailJob {
  call() {
    return new Promise((resolve, reject) => {
      db.reminder.findAll({
        where: {
          status: 'pending',
          sendAt: {
            $lte: new Date()
          }
        }
      }).then((reminders) => {
        let promises = Promise.all(reminders.map((reminder) => {
          return sendReminder(transporter, reminder);
        }));

        promises.then(resolve).catch(resolve);
      });
    });
  }

  static call() {
    let job = new ScheduledEmailJob();
    return job.call();
  }

  static transporter() {
    return transporter;
  }
}

module.exports = ScheduledEmailJob;
