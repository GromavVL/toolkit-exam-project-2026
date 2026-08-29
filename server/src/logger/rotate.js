const fs = require('fs');
const CONSTANT = require('../constants');

const buildFileName = () => {
  const timestamp = new Date()
    .toLocaleString('sv-SE', {
      timeZone: CONSTANT.TIMEZONE,
    })
    .slice(0, 10);

  return `${timestamp}${CONSTANT.LOG_ARCHIVE_SUFFIX}`;
};

const transformLine = line => {
  try {
    const { message, code, time } = JSON.parse(line);

    return JSON.stringify({ message, code, time });
  } catch (err) {
    return null;
  }
};

const transformContent = content => {
  const lines = content.split('\n').filter(Boolean);
  const transformed = lines.map(transformLine).filter(Boolean);
  return transformed.map(line => `${line}\n`).join('');
};

const rotateLog = () => {
  if (!fs.existsSync(CONSTANT.LOG_FILE)) {
    return null;
  }
  fs.mkdirSync(CONSTANT.LOGS_DIR, { recursive: true });

  const fileRead = fs.readFileSync(CONSTANT.LOG_FILE, CONSTANT.LOG_ENCODING);

  if (!fileRead.trim()) {
    return null;
  }
  const archivePath = `${CONSTANT.LOGS_DIR}/${buildFileName()}`;
  fs.writeFileSync(
    archivePath,
    transformContent(fileRead),
    CONSTANT.LOG_ENCODING
  );
  fs.truncateSync(CONSTANT.LOG_FILE, 0);

  return archivePath;
};

module.exports = rotateLog;
