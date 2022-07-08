const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({ message: `Error ${err}` });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('No user found with that ID');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'NotValid Data' });
      }
      if (error.statusCode === 404) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: `Validation Error! , ${error.message}` });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const updateUserProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((newData) => {
      res.send(newData);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: `Validation Error! , ${error.message}` });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((newAvatar) => {
      res.send(newAvatar);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: `Validation Error! , ${error.message}` });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
