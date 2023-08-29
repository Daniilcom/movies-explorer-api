const mongoose = require('mongoose');

const { ValidationError, CastError } = mongoose.Error;

const Movie = require('../models/movie');

const BadReqError = require('../utils/errors/bad-req-err');
const NotFoundError = require('../utils/errors/not-found-err');
const Forbidden = require('../utils/errors/forbidden-err');

const { SUCCESS_CODE, CREATED_CODE } = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(SUCCESS_CODE).send(movies))
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(CREATED_CODE).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .orFail(() => next(new NotFoundError('Фильм с данным id не найден')))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id.toString()) {
        throw new Forbidden('Фильм с данным id невозможно удалить');
      }
      res.status(SUCCESS_CODE).send({ message: 'Пост удален!' });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadReqError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
