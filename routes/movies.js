const router = require('express').Router(); // создали роутер
// const { celebrate, Joi } = require('celebrate'); // валидация приходящих данных
// const { isValidUrl } = require('../utils/methods');

const {
  getMovies,
  createMovies,
  deleteMoviesById,
} = require('../controllers/movies'); // импортируем контроллеры

router.get('/', getMovies);

router.post('/', // celebrate({
  // валидируем body
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     link: Joi.string().required().custom(isValidUrl),
//   }),
// }),
createMovies);

router.delete('/:movieId', // celebrate({
  // валидируем параметры
  // params: Joi.object().keys({
  //   cardId: Joi.string().required().hex().length(24),
  // }),
// }),
deleteMoviesById);

module.exports = router; // экспортировали роутер
