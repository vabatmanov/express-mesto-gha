const { celebrate, Joi, Segments } = require('celebrate');

const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().min(2).max(20).email(),
    password: Joi.string().required().min(8),
  })
})

const regValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().min(2).max(20).email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  })
})

const userIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().alphanum().max(24).required(),
  })
})

const updateProfileValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30)
  })
})

const updateAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required()
  })
})

const cardIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().alphanum().max(24).required(),
  })
})

const cardCreateValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    name: Joi.string().min(2).max(24).required(),
    link: Joi.string().required()
  })
})


  module.exports = {
    loginValidation,
    regValidation,
    userIdValidation,
    updateProfileValidation,
    updateAvatarValidation,
    cardIdValidation,
    cardCreateValidation
  }
