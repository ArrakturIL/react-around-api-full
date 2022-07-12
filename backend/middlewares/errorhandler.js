const { isCelebrateError } = require('celebrate');
const BadRequestErr = require('../errors/bad-request-err');

module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    throw new BadRequestErr('Request canot be processed');
  }
  res.status(err.statusCode).send({
    message: err.statusCode === 500 ? 'Internal server error' : err.message,
  });
  next();
};
