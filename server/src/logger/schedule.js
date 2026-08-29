const cron = require('node-cron');
const { styleText } = require('util');
const rotateLog = require('./rotate');
const CONSTANT = require('../constants');

const scheduleHandler = cron.schedule(
  '00 18 * * *',
  () => {
    const archivePath = rotateLog();

    console.log(
      archivePath
        ? styleText('green', 'Log created')
        : styleText('red', 'Log skipped')
    );
  },
  {
    timezone: CONSTANT.TIMEZONE,
  }
);

module.exports = scheduleHandler;
