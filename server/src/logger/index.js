const pino = require('pino');
const CONSTANT = require('../constants');

const logger = pino(
  {
    base: null,
    hooks: {
      streamWrite (s) {
        const { message, time, code, stackTrace } = JSON.parse(s);
        return `${JSON.stringify({ message, time, code, stackTrace })}\n`;
      },
    },
  },
  pino.destination(CONSTANT.LOG_FILE)
);

module.exports = logger;
