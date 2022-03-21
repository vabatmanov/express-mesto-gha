const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUserId = (req, res) => {
  User.find({_Id:req.params.userId})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
};


module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка создания пользователя' }));
}
/*

module.exports.createFilm = (req, res) => {
  const { title, genre, directorId } = req.body;

  Film.create({ title, genre, director: directorId })
    .then(film => res.send({ data: film }))
    .catch(err => res.status(500).send({ message: err.message }));
};
*/
