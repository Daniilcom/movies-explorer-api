require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./utils/errors/not-found-err');

const { PORT, DB_URL } = process.env;

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true, maxAge: 18000 }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const {
  validateСreation,
  validateLogin,
} = require('./middlewares/validation/auth-validator');
const { errHandler } = require('./middlewares/err-handler');
const { login, logout, createUser } = require('./controllers/users');

mongoose.connect(DB_URL);

app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateСreation, createUser);
app.post('/signin', validateLogin, login);

app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);

app.get('/signout', auth, logout);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use(errHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
