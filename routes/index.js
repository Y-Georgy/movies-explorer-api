const router = require('express').Router();
const userRouter = require('./users.js');
const moviesRouter = require('./movies.js');
// const NotFoundError = require('../errors/not-found-err');

router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use((req, res, next) => {
  // next(new NotFoundError('Ошибка - некорректный запрос'));
});

module.exports = router;
