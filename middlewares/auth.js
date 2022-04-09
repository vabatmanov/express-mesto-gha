const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, constants.SECRET_KEY);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }
  req.user = payload;

  next();
};
