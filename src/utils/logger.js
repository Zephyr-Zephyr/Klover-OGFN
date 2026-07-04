const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

// Stelle sicher, dass der logs-Ordner existiert
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  console.log(logMessage);

  const logFile = path.join(logsDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logMessage + '\n');
}

module.exports = {
  info: (message) => log('INFO', message),
  error: (message) => log('ERROR', message),
  warn: (message) => log('WARN', message),
  debug: (message) => log('DEBUG', message),
};
