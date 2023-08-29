const moviesRouter = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateCreateMovie,
  validateMovieId,
} = require('../middlewares/validation/movie-validator');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', validateCreateMovie, createMovie);
moviesRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
