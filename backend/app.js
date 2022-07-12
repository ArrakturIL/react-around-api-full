const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const errorhandler = require('./middlewares/errorhandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundErr = require('./errors/not-found-err');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standadHeaders: true,
  legacyHeaders: false,
});

mongoose.connect('mongodb://0.0.0.0:27017/arounddb', {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);

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

app.use(errorhandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
