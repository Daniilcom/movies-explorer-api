require('dotenv').config();
const express = require('express');
const cookies = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const { PORT, DB_URL } = process.env;

const router = require('./routes/index');

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://movies-web.nomoredomainsicu.ru',
      'http://movies-web.nomoredomainsicu.ru',
    ],
    credentials: true,
  }),
);

const { errHandler } = require('./middlewares/err-handler');

mongoose.connect(DB_URL);

app.use(express.json());
app.use(cookies());
app.use(limiter);
app.use(helmet());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.use(errors());
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
