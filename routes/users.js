const usersRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');

const {
  validateUpdateUser,
} = require('../middlewares/validation/user-validator');

usersRouter.get('/me', getUser);
usersRouter.patch('/me', validateUpdateUser, updateUser);

module.exports = usersRouter;
