const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const AuthError = require('../utils/errors/auth-err');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный URL',
      },
      require: [true, 'Поле "email" должно быть заполнено'],
      unique: [true, 'Такой email уже зарегестрирован'],
    },
    password: {
      type: String,
      require: [true, 'Поле "password" должно быть заполнено'],
      minlength: [8, 'Минимальная длина поля "password" - 8'],
      select: false,
    },
    name: {
      type: String,
      require: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new AuthError('Неправильные почта или пароль'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
