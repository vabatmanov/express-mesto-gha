const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const ObjectNotFound = require('./errors/ObjectNotFound');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');
const { loginValidation, regValidation } = require('./middlewares/validations');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', loginValidation, login);
app.post('/signup', regValidation, createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use(auth, (req, res, next) => {
  next(new ObjectNotFound('Указанный путь не существует'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен, на ${PORT} порт`);
});
