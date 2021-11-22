const Movie = require('../models/movie'); // импортируем модель
const User = require('../models/user'); // импортируем модель

const IncorrectDataError = require('../errors/incorrect-data-err');
// const ForbiddenDataError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (user.movies.length === 0) {
        return res.send({ message: 'Нет сохраненных фильмов' });
      }
      if (user.movies.length !== 0) {
        return Movie.find({ movieId: user.movies })
          .then((movies) => {
            if (movies.length === 0) {
              return res.send({ message: 'Фильм не сохранен в коллекции movies' });
            }
            return res.send({ data: movies });
          })
          .catch(next);
      }
      return next(new NotFoundError('Пользователь не найден'));
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    id,
  } = req.body;

  // Логика:
  // сохраненные пользователями фильмы хранятся в коллекции movies
  // фильмы не дублируются при сохранении разными пользователями
  // id фильмов, сохраненных пользователем, хранятся в коллекции users, в массиве movies
  function saveMovieToUserMovies(newMovie) {
    User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { movies: newMovie.movieId } }, // добавить id в массив, если его там нет
      { new: true },
    )
      .then((user) => {
        if (user) {
          return res.send({ data: [user, newMovie] });
        }
        throw new NotFoundError('Что то пошло не так1');
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          return next(new IncorrectDataError('Что то пошло не так2'));
        }
        return next(err);
      });
  }

  Movie.find({ movieId: id })
    .then((movie) => {
      if (movie.length === 0) { // Если нет такого фильма, то создать
        Movie.create({
          country,
          director,
          duration,
          year,
          description,
          image,
          trailer,
          nameRU,
          nameEN,
          thumbnail,
          movieId: id,
        })
          .then((newMovie) => {
            saveMovieToUserMovies(newMovie);
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              return next(new IncorrectDataError('Переданы некорректные данные при создании фильма'));
            }
            return next(err);
          });
      } else {
        saveMovieToUserMovies(movie[0]);
      }
    })
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  const id = req.params.movieId; // в параметрах передаем id фильма, а не mongo.id фильма

  // Удаляем id фильма из массива movies у пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { movies: id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        // проверяем есть ли у других пользователей этот фильм в сохраненых
        return User.find({ movies: id })
          .then((users) => {
            // если ни у одного пользователя этот фильм не сохранен, то удаляем его
            if (users.length === 0) {
              Movie.deleteOne({ movieId: id })
                .then((movie) => {
                  if (movie) {
                    return res.send({ message: 'Фильм удален успешно' });
                  }
                  throw new NotFoundError('Передан несуществующий _id фильма');
                })
                .catch((err) => {
                  if (err.name === 'CastError') {
                    return next(new IncorrectDataError('Переданы некорректные данные'));
                  }
                  return next(err);
                });
            }
            return res.send({ message: 'Фильм удален успешно' });
          });
      }
      throw new NotFoundError('Что то пошло не так');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncorrectDataError('Что то пошло не так'));
      }
      return next(err);
    });
};
