const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
  getCurrentUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
} = require('../controllers/users');
const {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  updateUserAvatarSchema,
} = require('./validation/schemas');

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.post('/signup', createUserSchema, createUser);
router.post('/signin', loginUserSchema, login);
router.patch('/users/me', auth, updateUserSchema, updateUserProfile);
router.patch(
  '/users/me/avatar',
  auth,
  updateUserAvatarSchema,
  updateUserAvatar
);

module.exports = router;
