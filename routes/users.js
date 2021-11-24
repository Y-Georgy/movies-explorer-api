const router = require('express').Router(); // создали роутер
const { validateUpdateProfile } = require('../middlewares/validations');
const { updateProfile, getUser } = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', validateUpdateProfile, updateProfile);

module.exports = router;
