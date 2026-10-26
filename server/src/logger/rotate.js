const fs = require('fs/promises');
const CONSTANT = require('../constants');

const buildFileName = () => {
  const timestamp = new Date()
    .toLocaleString('sv-SE', {
      timeZone: CONSTANT.TIMEZONE,
    })
    .slice(0, 16)
    .replaceAll(' ', '-');

  return `${timestamp}.ndjson`;
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

const rotateLog = async () => {
  try {
    let fileRead;
    try {
      fileRead = await fs.readFile(CONSTANT.LOG_FILE, CONSTANT.LOG_ENCODING);
    } catch (err) {
      return null;
    }

    if (!fileRead.trim()) {
      return null;
    }

    await fs.mkdir(CONSTANT.LOGS_DIR, { recursive: true });

    const archivePath = `${CONSTANT.LOGS_DIR}/${buildFileName()}`;
    await fs.writeFile(
      archivePath,
      transformContent(fileRead),
      CONSTANT.LOG_ENCODING
    );
    await fs.truncate(CONSTANT.LOG_FILE, 0);

    return archivePath;
  } catch (err) {
    return null;
  }
};

module.exports = rotateLog;
