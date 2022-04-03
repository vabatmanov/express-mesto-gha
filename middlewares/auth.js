const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

module.exports = (req, res, next) => {

  if (!req.cookies.jwt) {
    return res
      .status(403)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, constants.SECRET_KEY);
  } catch (err) {
    return res
      .status(403)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};