const Movie = require('../models/movie'); // импортируем модель
const User = require('../models/user'); // импортируем модель

const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenDataError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ })
    .then((movies) => {
      if (!movies) {
        return res.send({ message: 'Нет сохраненных фильмов' });
      }
      return res.send({ data: movies });
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
    movieId: id,
  } = req.body;

  function saveMovieToUserMovies(newMovie) {
    User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { movies: newMovie.movieId } }, // добавить id в массив, если его там нет
      { new: true },
    )
      .then((user) => {
        if (user) {
          return res.send({ data: user }); // можно отправить еще newMovie
        }
        throw new NotFoundError('Что то пошло не так');
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          return next(new IncorrectDataError('Что то пошло не так'));
        }
        return next(err);
      });
  }

  Movie.find({ movieId: id })
    .then((movie) => {
      if (!movie) { // Если нет такого фильма, то создать
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
        saveMovieToUserMovies(movie);
      }
    })
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => { // TODO доделать
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найдена');
      }
      if (movie.owner._id.toString() === userId) {
        Movie.findByIdAndRemove(movieId)
          .orFail(() => {
            throw new NotFoundError('Карточка с указанным _id не найдена');
          })
          .then((deletedMovie) => res.send({ data: deletedMovie }))
          .catch((err) => {
            if (err.name === 'CastError') {
              return next(new IncorrectDataError('Передан некорректный id при удалении карточки'));
            }
            return next(err);
          });
      } else {
        throw next(new ForbiddenDataError('У Вас нет прав на удаление этой карточки'));
      }
    })
    .catch(next);
};

// module.exports.saveMovie = (req, res, next) => {
//   const newMovie = req.movie;

//   User.findByIdAndUpdate(
//     req.user._id,
//     // TODO проверить ключ в req.movies
//     { $addToSet: { movies: newMovie.movieId } }, // добавить _id в массив, если его там нет
//     { new: true },
//   )
//     .then((user) => {
//       if (user) {
//         return res.send({ data: user }); // можно отправить еще newMovie
//       }
//       throw new NotFoundError('Что то пошло не так');
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new IncorrectDataError('Что то пошло не так'));
//       }
//       next(err);
//     });
// };

// module.exports.removeMovie = (req, res, next) => {
//   const newMovie = req.movie;

//   User.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } }, // убрать _id из массива
//     { new: true, runValidators: true },
//   )
//     .then((card) => {
//       if (card) {
//         return res.send({ data: card });
//       }
//       throw new NotFoundError('Передан несуществующий _id карточки');
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new IncorrectDataError('Переданы некорректные данные для постановки/снятии лайка'));
//       }
//       next(err);
//     });
// };

// УДАЛЕНИЕ MOVIEID у USER.movies
// User.findByIdAndUpdate(
//   req.user._id,
//   { $pull: { movies: movie.movieId } }, // убрать _id из массива
//   { new: true, runValidators: true },
// )
//   .then((user) => {
//     if (user) {
//       return res.send({ data: user }); // можно отправить еще newMovie
//     }
//     throw new NotFoundError('Что то пошло не так');
//   })
//   .catch((err) => {
//     if (err.name === 'CastError') {
//       return next(new IncorrectDataError('Что то пошло не так'));
//     }
//     return next(err);
//   });
