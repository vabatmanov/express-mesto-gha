const Card = require('../models/card');
const ObjectNotFound = require('../errors/ObjectNotFound');
const ErrorAccessDenied = require('../errors/ErrorAccessDenied');
const ErrorValidation = require('../errors/ErrorValidation');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new ObjectNotFound(`Карточка с указанным _id='${req.params.cardId}' не найдена`);
    })
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        throw new ErrorAccessDenied('Попытка удалить чужую карточку');
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ObjectNotFound(`Карточка с указанным _id='${req.params.cardId}' не найдена`));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new ObjectNotFound(`Передан несуществующий _id='${req.params.cardId}' карточки`);
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new ObjectNotFound(`Передан несуществующий _id='${req.params.cardId}' карточки`);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new ObjectNotFound(`Передан несуществующий _id='${req.params.cardId}' карточки`);
    })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new ObjectNotFound(`Передан несуществующий _id='${req.params.cardId}' карточки`);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorValidation('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};
