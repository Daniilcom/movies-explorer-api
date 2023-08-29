const SUCCESS_CODE = 200;
const CREATED_CODE = 201;
const RegExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

// const PORT = '3000';
// const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

module.exports = {
  SUCCESS_CODE,
  CREATED_CODE,
  RegExp,
};
