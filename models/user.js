const mongoose = require('mongoose');
const {isEmail, isURL} = require('validator');

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
    minlength: 2,
    maxlength: 30,
    required: true,
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
    validate: [isURL, 'invalid avatar URL']
  },
});

module.exports = mongoose.model('user', userSchema);
