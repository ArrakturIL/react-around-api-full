/* ========================================================================== */
/* =                             IMPORTS                                    = */
/* ========================================================================== */
import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

/* ========================================================================== */
/* =                          MAIN COMPONENT                                = */
/* ========================================================================== */

function Main({
  onEditProfileClick,
  onAddPlaceClick,
  onEditAvatarClick,
  onCardClick,
  onConfirmDeleteClick,
  onCardDelete,
  onCardLike,
  cards,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container">
          <div className="profile__avatar-overlay">
            <button
              className="profile__avatar-edit"
              type="button"
              id="edit-avatar"
              onClick={onEditAvatarClick}
            />
          </div>
          <img
            src={currentUser.avatar}
            alt="avatar"
            className="profile__avatar-img"
          />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <p className="profile__about">{currentUser.about}</p>
          <button
            type="button"
            className="profile__edit-button"
            onClick={onEditProfileClick}
          ></button>
        </div>

        <button
          onClick={onAddPlaceClick}
          type="button"
          className="profile__add-button"
        ></button>
      </section>

      <section className="elements">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onConfirmDeleteClick={onConfirmDeleteClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
