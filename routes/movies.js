const router = require('express').Router(); // создали роутер
const { validateCreateMovie, validateMovieId } = require('../middlewares/validations');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovieById);

module.exports = router;
