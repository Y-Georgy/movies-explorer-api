const router = require('express').Router(); // создали роутер
// const { celebrate, Joi } = require('celebrate'); // валидация приходящих данных
// const { isValidUrl } = require('../utils/methods');
const {
  updateProfile,
  getUser,
} = require('../controllers/users'); // импортируем контроллеры

router.get('/me', getUser);

router.patch('/me', // celebrate({
  // валидируем body
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     about: Joi.string().required().min(2).max(30),
//   }),
// }),
updateProfile);

module.exports = router; // экспортировали роутер
