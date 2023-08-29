const { celebrate, Joi } = require('celebrate');

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
  }),
});
