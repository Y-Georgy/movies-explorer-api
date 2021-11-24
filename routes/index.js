const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { validateCreateUser, validateLoginUser } = require('../middlewares/validations');
const { createUser, login, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');

const IncorrectDataError = require('../errors/incorrect-data-err');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLoginUser, login);
router.get('/signout', logout);
router.use(auth);
router.use('/', userRouter);
router.use('/', moviesRouter);

router.use((req, res, next) => {
  next(new IncorrectDataError('Ошибка - ресурс не найден'));
});

module.exports = router;
