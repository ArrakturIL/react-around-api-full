const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const LoginErr = require('../errors/login-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator(v) {
        return /(https?:\/\/)(www\.)?[-A-Za-z0-9+&@#/%?=~_|!:,.;]+\.*[.\-A-Za-z0-9+&@#/%=~_|?#]/gim.test(
          v,
        );
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new LoginErr('Incorrect email or password.'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new LoginErr('Incorrect email or password.'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
