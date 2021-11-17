const router = require('express').Router(); // создали роутер
const { validateUpdateProfile } = require('../middlewares/validations');
const { updateProfile, getUser } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', validateUpdateProfile, updateProfile);

module.exports = router;
