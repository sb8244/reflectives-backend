const createServer = require('app/server').createServer;
const server = createServer();
const passwordless = require('app/passwordless').passwordless;

describe('POST /sendtoken', function() {
  beforeEach(function() {
    this.request = {
      method: 'POST',
      url: '/sendtoken',
      payload: {
        user: 'test@test.com',
        delivery: 'test'
      }
    };

    spyOn(passwordless._defaultDelivery, 'sendToken').and.callFake((tokenToSend, uidToSend, recipient, callback) => {
      this.deliveryArgs = { tokenToSend, uidToSend, recipient, callback };
      callback();
    });
    passwordless._defaultDelivery.sendToken.calls.reset();
  });

  it('is successful', function(done) {
    server.inject(this.request, function(response) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });

  it('queues the email delivery', function(done) {
    server.inject(this.request, (response) => {
      expect(passwordless._defaultDelivery.sendToken).toHaveBeenCalled();
      expect(this.deliveryArgs.recipient).toEqual("test@test.com");
      done();
    });
  });

  it('serves a 401 without a user', function(done) {
    this.request.payload.user = '';
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(401);
      expect(response.headers['www-authenticate']).toEqual('Provide a valid user');
      done();
    });
  });

  it('serves a 400 when user is false', function(done) {
    this.request.payload.user = false;
    server.inject(this.request, (response) => {
      expect(response.statusCode).toEqual(400);
      done();
    });
  });
});
