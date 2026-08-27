const pino = require('pino');

// logger.error({ message: '', code: 404, stackTrace: {} });

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
  pino.destination(`${__dirname}/log.ndjson`)
);

module.exports = logger;
