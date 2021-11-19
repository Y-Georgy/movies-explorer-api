const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { validateCreateUser, validateLoginUser } = require('../middlewares/validations');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLoginUser, login);
router.get('/signout', logout);

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Ошибка - некорректный запрос'));
});

module.exports = router;
