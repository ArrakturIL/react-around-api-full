const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const {
  celebrate, Joi, errors, isCelebrateError,
} = require('celebrate');
const cors = require('cors');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const BadRequestErr = require('./errors/bad-request-err');
const NotFoundErr = require('./errors/not-found-err');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/arounddb');

const { PORT = 3000 } = process.env;

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

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);

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
