const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

function validateUrl(string) {
  if (!validator.isURL(string)) {
    throw new Error('Invalid URL');
  }
  return string;
}

const createCardSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validateUrl),
  }),
});

const cardIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});

const createUserSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
    avatar: Joi.string().custom(validateUrl),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

const loginUserSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

const updateUserSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
  }),
});

const updateUserAvatarSchema = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateUrl),
  }),
});

module.exports = {
  createCardSchema,
  cardIdSchema,
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  updateUserAvatarSchema,
};
