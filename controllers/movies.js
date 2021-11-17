const Movie = require('../models/movie'); // импортируем модель
const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenDataError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Movie.create({ name, link, owner })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncorrectDataError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Movie.findById(cardId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }

      if (movie.owner._id.toString() === userId) {
        Movie.findByIdAndRemove(cardId)
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
