const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})

    .then((cards) => res.send(cards))
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(400).send({ message: 'NotValid Data' });
      } else {
        res
          .status(500)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((newCard) => res.send(newCard))
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

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('No card found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send(card))
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

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    const error = new Error('No card found with that id');
    error.statusCode = 404;
    throw error;
  })
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'NotValid Data' });
    }
    if (error.statusCode === 404) {
      res.status(404).send({ message: 'Card not found' });
    } else {
      res
        .status(500)
        .send({ message: 'An error has occurred on the server' });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    const error = new Error('No card found with that id');
    error.statusCode = 404;
    throw error;
  })
  .then((card) => res.send(card))
  .catch((error) => {
    if (error.name === 'CastError') {
      res.status(400).send({ message: 'NotValid Data' });
    }
    if (error.statusCode === 404) {
      res.status(404).send({ message: 'Card not found' });
    } else {
      res
        .status(500)
        .send({ message: 'An error has occurred on the server' });
    }
  });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
