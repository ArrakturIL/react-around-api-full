const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors, isCelebrateError } = require('celebrate');
const cors = require('cors');
const BadRequestErr = require('./errors/bad-request-err');
const NotFoundErr = require('./errors/not-found-err');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const bodyParser = require('body-parser');
const { PORT = 3000, NODE_ENV } = process.env;
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/arounddb', {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use('/', userRouter, cardRouter);

app.get('*', () => {
  throw new NotFoundErr('Page not found');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    throw new BadRequestErr('Request canot be processed');
  }
  res.status(err.statusCode).send({
    message: err.statusCode === 500 ? 'Internal server error' : err.message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
