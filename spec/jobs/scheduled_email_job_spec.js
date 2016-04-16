'use strict';

const ScheduledEmailJob = require('app/jobs/scheduled_email_job');
const db = require('app/models');
const moment = require('moment');

fdescribe('ScheduledEmailJob', function() {
  it('does nothing without pending jobs', function(done) {
    ScheduledEmailJob.call().then(done);
  });

  it('delivers pending emails sendAt in the past', function(done) {
    db.reminder.bulkCreate([{
      reflectionCollectionId: 1,
      status: "pending",
      sendAt: moment()
    }, {
      reflectionCollectionId: 2,
      status: "pending",
      sendAt: moment().add(1, 'minutes')
    }]).then(() => {
      spyOn(ScheduledEmailJob.transporter(), 'sendMail').and.callFake(function(mailOptions, callback) {
        callback(undefined);
      });

      ScheduledEmailJob.call().then(() => {
        expect(ScheduledEmailJob.transporter().sendMail.calls.count()).toEqual(1);
        done();
      });
    });
  });
});
