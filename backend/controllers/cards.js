const Card = require('../models/card');
const NotFoundErr = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ForbiddenErr = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(200).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError')
        next(new BadRequestErr('Validation failed. Check your request.'));
      else next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundErr('The requested card was not found');
    })
    .then((card) => {
      if (card.owner.equals(req.user._id)) res.status(200).send(card);
      else {
        throw new ForbiddenErr('You are not allowed to delete this card');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestErr('Invalid data'));
      else next(err);
    });
};

const likeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundErr('The requested card was not found');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestErr('Invalid data'));
      else next(err);
    });

const dislikeCard = (req, res, next) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundErr('The requested card was not found');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestErr('Invalid data'));
      else next(err);
    });

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
