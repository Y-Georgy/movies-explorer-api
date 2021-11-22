const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { validateCreateUser, validateLoginUser } = require('../middlewares/validations');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/not-found-err');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLoginUser, login);
router.get('/signout', logout);
router.use(auth);
router.use('/', userRouter);
router.use('/', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Ошибка - некорректный запрос'));
});

module.exports = router;
