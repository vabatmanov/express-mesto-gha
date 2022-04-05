const mongoose = require('mongoose');
const {isEmail} = require('validator');
const Unauthorized = require('../errors/Unauthorized');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    unique: true,
    validate: [isEmail, 'invalid email']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: [(avatar) => {return /((https?:\/{2})|(w{3}\.))[\/\w-.#~:?\[\]@!$&'()*+,;=]+/g.test(avatar)}, 'invalid avatar URL']
  },
});
//(data) => {console.log ('/https?:\/{2}(?:[\/-\w.#]|(?:%[\da-fA-F]{2}))+/g`'.test(data))}
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
          }
          return user;
        })
    });
};

module.exports = mongoose.model('user', userSchema);
