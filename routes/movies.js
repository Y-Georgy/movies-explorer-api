const router = require('express').Router(); // создали роутер
const { validateCreateMovie, validateMovieId } = require('../middlewares/validations');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('/movies/:movieId', validateMovieId, deleteMovieById);

module.exports = router;
