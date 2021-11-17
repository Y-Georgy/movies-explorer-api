const { celebrate, Joi } = require('celebrate'); // валидация приходящих данных
// const { isValidUrl } = require('../utils/methods');

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateMovieId = celebrate({
  // валидируем id в параметрах запроса
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

const validateCreateMovie = celebrate({
  // валидируем данные Movie из body
  body: Joi.object().keys({ // TODO настроить валидацию
    // country: Joi.string().required().min(2).max(30),
    // director: Joi.string().required().custom(isValidUrl),
    // duration: Joi.string().required().min(2).max(30),
    // year: Joi.string().required().min(2).max(30),
    // description: Joi.string().required().min(2).max(30),
    // image: Joi.string().required().min(2).max(30),
    // trailer: Joi.string().required().min(2).max(30),
    // nameRU: Joi.string().required().min(2).max(30),
    // nameEN: Joi.string().required().min(2).max(30),
    // thumbnail: Joi.string().required().min(2).max(30),
    // movieId: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  validateUpdateProfile,
  validateCreateMovie,
  validateMovieId,
};
