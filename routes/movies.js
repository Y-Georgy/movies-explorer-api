const router = require('express').Router(); // создали роутер
const { validateCreateMovie, validateMovieId } = require('../middlewares/validations');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('/movies/:id', validateMovieId, deleteMovieById);

module.exports = router;
