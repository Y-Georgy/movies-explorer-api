const { celebrate, Joi } = require('celebrate'); // валидация приходящих данных
const { isValidUrl } = require('../utils/methods');

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateMovieId = celebrate({
  // валидируем id в параметрах запроса
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

const validateCreateMovie = celebrate({
  // валидируем данные Movie из body
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isValidUrl),
    trailer: Joi.string().required().custom(isValidUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(isValidUrl),
    movieId: Joi.number().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(1).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required()
  }),
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required()
  }),
});

module.exports = {
  validateUpdateProfile,
  validateCreateMovie,
  validateMovieId,
  validateCreateUser,
  validateLoginUser,
};
