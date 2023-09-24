const router = require('express').Router();

const NotFoundError = require('../utils/errors/not-found-err');

const {
  validateСreation,
  validateLogin,
} = require('../middlewares/validation/auth-validator');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');

const { login, logout, createUser } = require('../controllers/users');

router.post('/signup', validateСreation, createUser);
router.post('/signin', validateLogin, login);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.get('/signout', auth, logout);
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
