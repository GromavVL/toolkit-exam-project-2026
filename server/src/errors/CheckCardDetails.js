const ApplicationError = require('./ApplicationError');

class CheckCardDetails extends ApplicationError {
  constructor (message) {
    super(message || 'Invalid expiry date and CVC', 418);
  }
}

module.exports = CheckCardDetails;
