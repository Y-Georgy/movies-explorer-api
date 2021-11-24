const bcrypt = require('bcryptjs'); // установленный модуль для хеширования пароля
const validator = require('validator');
const jwt = require('jsonwebtoken'); // модуль для создания токенов
const User = require('../models/user'); // импортируем модель
const { JWT_SECRET } = require('../config');

const IncorrectDataError = require('../errors/incorrect-data-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/сonflict-err');

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
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id, // первый параметр - id пользователя
    {
      name,
      email,
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
      if (err.code === 11000) {
        return next(new ConflictError('Переданный Email уже используется другим пользователем'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10) // хешируем пароль
    .then((hash) => {
      if (!validator.isEmail(email)) {
        throw new IncorrectDataError('Передан некорректный e-mail');
      }
      return User.create({
        name,
        email,
        password: hash, // вместо пароля передаем его хеш
      });
    })
    .then((user) => {
      const dataUser = {
        name: user.name,
        email: user.email,
        _id: user._id,
      };
      res
        .send({
          data: dataUser,
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError(err.message));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким e-mail уже существует'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // пользователь с такой почтой не найден
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши паролей не совпали — отправляем ошибку
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          // аутентификация успешна
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );

          return res
            // отправляем jwt в cookie для защиты от XSS-атаки.
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              secure: true,
              sameSite: 'none',
            })
            .send({ message: 'Вход совершен успешно' });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt')
    .end();
};
