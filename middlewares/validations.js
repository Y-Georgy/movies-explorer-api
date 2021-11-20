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
    movieId: Joi.number().required(), // Это не mongo.id, а id фильма, поэтому без .hex().length(24)
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
    id: Joi.number().required(),
  }),
});

const passwRegex = /^[a-zA-Z0-9]{8,}/; // TODO проверить

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp(passwRegex)),
  }),
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .pattern(new RegExp(passwRegex)),
  }),
});

module.exports = {
  validateUpdateProfile,
  validateCreateMovie,
  validateMovieId,
  validateCreateUser,
  validateLoginUser,
};
