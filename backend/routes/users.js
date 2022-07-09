const express = require('express');
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const router = express.Router();
const {
  getUsers,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

function validateUrl(string) {
  if (!validator.isURL(string)) {
    throw new Error('Invalid URL');
  }
  return string;
}

router.get('/users', auth, getUsers);
router.get('/users/me', auth, getCurrentUser);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2),
      avatar: Joi.string().custom(validateUrl),
    }),
  }),
  updateUserProfile,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().custom(validateUrl),
    }),
  }),
  updateUserAvatar,
);

module.exports = router;
