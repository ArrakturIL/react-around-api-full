const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: './logs/requests.log' }),
  ],
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: './logs/errors.log' })],
});

module.exports = {
  requestLogger,
  errorLogger,
};
