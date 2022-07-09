const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const LoginErr = require('../errors/login-err');
const EmailConflictErr = require('../errors/email-conflict-err');
require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestErr('Validation failed. Check your request.'));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      email: user.email,
      avatar: user.avatar,
    }))
    .catch((error) => {
      if (error.name === 'ValidationError') next(new BadRequestErr('Validation failed. Check your request.'));
      else if (error.name === 'MongoError' || error.code === 11000) next(new EmailConflictErr('User with this email already exists.'));
      else next(error);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .onFail(() => {
      throw new NotFoundErr('User not found.');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') next(new BadRequestErr('Validation failed. Check your request.'));
      else next(error);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .onFail(() => {
      throw new NotFoundErr('User not found.');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') next(new BadRequestErr('Validation failed. Check your request.'));
      else next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('User not found.');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
          user: {
            name: user.name,
            about: user.about,
            email: user.email,
            avatar: user.avatar,
          },
        });
    })
    .catch(() => {
      next(new LoginErr('Authorization Required'));
    });
};

module.exports = {
  login,
  getUsers,
  getCurrentUser,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
