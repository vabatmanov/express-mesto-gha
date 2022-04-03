const User = require('../models/user');
const constants = require('../utils/constants');
const bcrypt = require('bcrypt');
const {ObjectNotFound} = require('../errors/ObjectNotFound');
const ErrorConflict = require('../errors/ErrorConflict');
const jwt = require('jsonwebtoken');


module.exports.login = (req, res) => {
  const {email, password} = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, constants.SECRET_KEY, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true
        })
        .send({ message: 'Access token received' });
    })
    .catch((err) => {
      res.status(err.statusCode || constants.SOME_ERROR).send({message: err.message});
    });
}

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
      if (err.name === 'CastError') {
        return res.status(constants.VALIDATION_ERROR_STATUS).send({ message: `Пользователь по указанному _id='${req.params.userId}' не найден` });
      }
      if (err.name === 'ObjectNotFound') {
        return res.status(constants.NOT_FOUND).send({ message: `Пользователь по указанному _id='${req.params.userId}' не найден` });
      }
      return res.status(constants.SOME_ERROR).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {email, password, name, about, avatar } = req.body;
  User.findOne({email})
    .then((user) => {
      if (user) {
        throw new ErrorConflict(`Пользователь с таким email уже существует`);
      }
      return bcrypt.hash(password, constants.SALT_ROUNDS)
    })
    .then((hash) => {
      return User.create({email, password: hash, name, about, avatar})
    })
    .then((user) => res.send({data: user}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(constants.VALIDATION_ERROR_STATUS).send({message: 'Переданы некорректные данные при создании пользователя'});
      } else {
        res.status(err.statusCode || constants.SOME_ERROR).send({message: err.message});
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
