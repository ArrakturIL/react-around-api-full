import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ onCardClick, card, onConfirmDeleteClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = currentUser._id === card.owner._id;

  const isLiked = card.likes.some((like) => like._id === currentUser._id);

  const likeButtonClassName = `element__post-like${
    isLiked ? ' element__post-like_active' : ''
  }`;

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleCardClick() {
    onCardClick(card);
  }
  function handleDeleteClick() {
    onConfirmDeleteClick(card);
  }

  return (
    <article className="element">
      {isOwn && (
        <button
          className="element__delete"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <img
        className="element__post-img"
        alt={card.name}
        src={card.link}
        onClick={handleCardClick}
      />
      <div className="element__post-info">
        <h2 className="element__post-name">{card.name}</h2>
        <div className="element__like-wrapper">
          <button
            type="button"
            className={likeButtonClassName}
            onClick={handleLikeClick}
          />
          <span className="element__like-count"> {card.likes.length} </span>
        </div>
      </div>
    </article>
  );
}

export default Card;
