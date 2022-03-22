const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
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
    .catch(() => res.status(500).send({message: 'Произошла ошибка удаления карты'}));
}

/*
router.get('/', getCards);
router.post('/', createCard);
router.delete('/', deleteCard);*/
