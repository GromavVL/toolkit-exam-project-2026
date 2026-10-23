const pino = require('pino');
const CONSTANT = require('../constants');

const logger = pino(
  {
    base: null,
  },
  pino.destination(CONSTANT.LOG_FILE)
);

module.exports = logger;
