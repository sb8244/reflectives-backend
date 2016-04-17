'use strict';

const ScheduledEmailJob = require('app/jobs/scheduled_email_job');
const db = require('app/models');
const moment = require('moment');

function* setupEmails() {
  let user = yield db.user.create({ email: 'test@test.com' });
  let user2 = yield db.user.create({ email: 'test2@test.com' });

  let collection = yield db.reflectionCollection.create({
    reflections: [
      { name: 'First Question', html: 'First', secondsOfWriting: 1, order: 0 },
      { name: 'Second Question', html: '<div>Second</div>', secondsOfWriting: 1, order: 1 }
    ],
    reminders: [
      { status: "pending", sendAt: moment(), userId: user.id },
      { status: "pending", sendAt: moment().add(1, 'minutes'), userId: user.id }
    ]
  }, { include: [ db.reflection, db.reminder ] });
  let collection2 = yield db.reflectionCollection.create({
    reflections: [
      { name: 'First Question', html: '<p></p>', secondsOfWriting: 1, order: 0 },
    ],
    reminders: [
      { status: "pending", sendAt: moment(), userId: user2.id }
    ]
  }, { include: [ db.reflection, db.reminder] });
}

fdescribe('ScheduledEmailJob', function() {
  it('does nothing without pending jobs', function*() {
    yield ScheduledEmailJob.call();
  });

  it('delivers pending emails sendAt in the past to the correct user', function*() {
    yield setupEmails();

    spyOn(ScheduledEmailJob.transporter, 'sendMail').and.callFake(function(mailOptions, callback) {
      callback(undefined);
    });

    yield ScheduledEmailJob.call();
    expect(ScheduledEmailJob.transporter.sendMail.calls.count()).toEqual(2);
  });

  it('delivers pending emails with the correct parameters', function*() {
    yield setupEmails();

    let usedEmails = [];
    let passedOptions = {};
    spyOn(ScheduledEmailJob.transporter, 'sendMail').and.callFake(function(mailOptions, callback) {
      usedEmails.push(mailOptions.to);
      passedOptions[mailOptions.to] = mailOptions;
      callback(undefined);
    });

    yield ScheduledEmailJob.call();
    expect(ScheduledEmailJob.transporter.sendMail.calls.count()).toEqual(2);
    expect(usedEmails.indexOf('test@test.com')).not.toEqual(-1);
    expect(usedEmails.indexOf('test2@test.com')).not.toEqual(-1);
    console.log(passedOptions);
  });
});
