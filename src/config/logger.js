const config = require('./config');

const logger = {
  debug: (...args) => {
    if (['debug'].includes(config.logLevel)) console.log('[DEBUG]', ...args);
  },
  info: (...args) => {
    if (['debug', 'info'].includes(config.logLevel)) console.log('[INFO]', ...args);
  },
  error: (...args) => {
    if (['debug', 'info', 'error'].includes(config.logLevel)) console.log('[ERROR]', ...args);
  },
};

module.exports = logger;
