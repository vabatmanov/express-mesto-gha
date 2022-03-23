const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner','likes'])
    .then(card => res.send({data: card}))
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.createCard = (req, res) => {
  //const owner = req.user._id
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => res.send({data: card}))
    .catch(err => res.status(500).send({message: err.message}));
};


module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({data: card}))
    .catch(() => res.status(404).send({message: 'карточка или пользователь не найден'}));
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true, runValidators: true})
    .populate(['owner','likes'])
    .then(card => res.send({data: card}))
    .catch(() => res.status(404).send({message: 'карточка или пользователь не найден'}));
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true, runValidators: true})
    .populate(['owner','likes'])
    .then(card => res.send({data: card}))
    .catch(() => res.status(404).send({message: 'карточка или пользователь не найден'}));
}