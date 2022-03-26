const Card = require('../models/card');
const constants = require('../utils/constants')
const ObjectNotFound = require('../errors/ObjectNotFound')

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then(card => res.send({data: card}))
    .catch(err => res.status(constants.SOME_ERROR).send({message: err.message}));
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => res.send({data: card}))
    .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(constants.VALIDATION_ERROR_STATUS).send({message: "Переданы некорректные данные при создании карточки"});
        } else {
          res.status(constants.SOME_ERROR).send({message: err.message});
        }
      }
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ObjectNotFound(`Карточка с указанным _id='${req.params.cardId}' не найдена`);
    })
    .then(card => res.send({data: card}))
    .catch((err) => {
      console.log(`${err.name}   ${err.statusCode}      ${err.message}`)
      if (err.name === 'CastError' || err.name === 'ObjectNotFound') {
        res.status(constants.NOT_FOUND).send({message: `Карточка с указанным _id='${req.params.cardId}'не найдена`})
      } else {
        res.status(constants.SOME_ERROR).send({message: err.message});
      }
    });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: req.user._id}}, {new: true})
    .orFail(() => {
      throw new ObjectNotFound(`Передан несуществующий _id='${req.params.cardId}' карточки`);
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new ObjectNotFound(`Передан несуществующий _id='${req.params.cardId}' карточки`);
      }
      res.send({data: card})
    })
    .catch((err) => {
      if (err.name === 'ObjectNotFound') {
        return res.status(err.statusCode).send({message: err.message})
      }
      if (err.name === 'CastError') {
        return res.status(constants.VALIDATION_ERROR_STATUS).send({message: `Переданы некорректные данные для постановки/снятии лайка`})
      }
      return res.status(constants.SOME_ERROR).send({message: err.message});
    });
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {$pull: {likes: req.user._id}}, {new: true, runValidators: true})
    .orFail(() => {
      throw new ObjectNotFound(`Передан несуществующий _id='${req.params.cardId}' карточки`);
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new ObjectNotFound(`Передан несуществующий _id='${req.params.cardId}' карточки`);
      }
      res.send({data: card})
    })
    .catch((err) => {
      if (err.name === 'ObjectNotFound') {
        return res.status(err.statusCode).send({message: err.message})
      }
      if (err.name === 'CastError') {
        return res.status(constants.VALIDATION_ERROR_STATUS).send({message: `Переданы некорректные данные для постановки/снятии лайка`})
      }
      return res.status(constants.SOME_ERROR).send({message: err.message});
    });
}