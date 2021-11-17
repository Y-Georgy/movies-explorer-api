// require('dotenv').config();
// const bcrypt = require('bcryptjs'); // установленный модуль для хеширования пароля
// const validator = require('validator');
// const jwt = require('jsonwebtoken'); // модуль для создания токенов
const User = require('../models/user'); // импортируем модель

const IncorrectDataError = require('../errors/incorrect-data-err');
// const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
// const ConflictError = require('../errors/сonflict-err');

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (user) {
        return res.send({
          data: user,
        });
      }
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectDataError('Передан некорректный id пользователя'));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id, // первый параметр - id пользователя
    {
      name,
      about,
    }, // что обновляем
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (user) {
        return res.send({
          data: user,
        });
      }
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectDataError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        return next(new IncorrectDataError('Передан некорректный id пользователя'));
      }
      return next(err);
    });
};
