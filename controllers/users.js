const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadReqError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const Conflict = require('../utils/errors/conflict-err');

const {
  NODE_ENV, JWT_SECRET,
} = process.env;

const { CREATED_CODE, SUCCESS_CODE } = require('../utils/constants');

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(CREATED_CODE).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Переданы некорректные данные'));
      }
      if (err instanceof ValidationError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .status(SUCCESS_CODE)
        .send({
          id: user._id,
          email: user.email,
          name: user.name,
        });
    })
    .catch((err) => {
      next(err);
    });
};

const logout = (req, res) => {
  res.clearCookie('jwt').status(SUCCESS_CODE).send({ message: 'Выход выполнен' });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => {
      res.status(SUCCESS_CODE).send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => {
      res.status(SUCCESS_CODE).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  login,
  logout,
  createUser,
  getUser,
  updateUser,
};
