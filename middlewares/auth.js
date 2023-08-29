const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new AuthError('Необходимо авторизоваться'));
    return;
  }
  req.user = payload;
  next();
};
