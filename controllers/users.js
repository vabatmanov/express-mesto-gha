const User = require('../models/user');
const constants = require('../utils/constants');
const ObjectNotFound = require('../errors/ObjectNotFound');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(constants.SOME_ERROR).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ObjectNotFound(`Пользователь по указанному _id='${req.params.userId}' не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ObjectNotFound') {
        res.status(constants.NOT_FOUND).send({ message: `Пользователь по указанному _id='${req.params.userId}' не найден` });
      } else {
        res.status(constants.SOME_ERROR).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.VALIDATION_ERROR_STATUS).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(constants.SOME_ERROR).send({ message: err.message });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ObjectNotFound(`Пользователь с указанным _id='${req.params.userId}' не найден`);
    })
    .then((user) => {
      if (!user) {
        throw new ObjectNotFound(`Пользователь с указанным _id='${req.params.userId}' не найден`);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ObjectNotFound') {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(constants.VALIDATION_ERROR_STATUS).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(constants.SOME_ERROR).send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ObjectNotFound(`Пользователь с указанным _id='${req.params.userId}' не найден`);
    })
    .then((user) => {
      if (!user) {
        throw new ObjectNotFound(`Пользователь с указанным _id='${req.params.userId}' не найден`);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ObjectNotFound') {
        return res.status(err.statusCode).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(constants.VALIDATION_ERROR_STATUS).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(constants.SOME_ERROR).send({ message: err.message });
    });
};
