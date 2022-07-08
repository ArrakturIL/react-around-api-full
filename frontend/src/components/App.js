/* ========================================================================== */
/* =                             IMPORTS                                    = */
/* ========================================================================== */

import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import * as auth from '../utils/auth';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';
import UserDetails from './UserDetails';
/* ========================================================================== */
/* =                               MAIN APP                                 = */
/* ========================================================================== */

function App() {
  /* ========================================================================== */
  /* =                             USE STATE                                  = */
  /* ========================================================================== */
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState(false);
  const [isEditAvatarOpen, setIsEditAvatarOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] =
    useState(false);
  const [cardPopup, setCardPopup] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [selectedToDeleteCard, setSelectedToDeleteCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthOkPopupOpen, setIsAuthOkPopupOpen] = useState(false);
  const [isAuthErrorPopupOpen, setIsAuthErrorPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isMobileSized, setIsMobileSized] = useState(window.innerWidth <= 650);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const handleResize = () => setWindowWidth(window.innerWidth);

  /* ========================================================================== */
  /* =                             USE EFFECT                                 = */
  /* ========================================================================== */

  useEffect(() => {
    const getUserInfoFromAPI = () => {
      return api.getUserInfo();
    };
    const getUserInfoFromToken = () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) return auth.getContent(jwt);
    };
    Promise.allSettled([getUserInfoFromAPI(), getUserInfoFromToken()])
      .then((values) => {
        const apiUserInfo = values[0].value;
        const tokenUserInfo = values[1].value?.data;
        setCurrentUser({ ...tokenUserInfo, ...apiUserInfo });
        if (tokenUserInfo) setIsLoggedIn(true);
        navigate('/');
      })
      .catch((err) => console.log(`Error: ${err}`));
    // eslint-disable-next-line
  }, []);
  // ========================================================================== //

  useEffect(() => {
    api
      .getInitialCards()
      .then((cardsData) => {
        setCards(cardsData);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }, []);

  // ========================================================================== //
  const handlePopupClick = (e) => {
    (isEditProfileOpen ||
      isAddPlaceOpen ||
      isEditAvatarOpen ||
      isConfirmDeletePopupOpen ||
      cardPopup ||
      isAuthOkPopupOpen ||
      isAuthErrorPopupOpen) &&
      closeAllPopups();
  };

  //==========================================================================//
  useEffect(() => {
    const handleEscClose = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    if (
      isEditProfileOpen ||
      isAddPlaceOpen ||
      isEditAvatarOpen ||
      isConfirmDeletePopupOpen ||
      cardPopup
    ) {
      document.addEventListener('keydown', handleEscClose);
    }
    return () => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [
    isEditProfileOpen,
    isAddPlaceOpen,
    isEditAvatarOpen,
    isConfirmDeletePopupOpen,
    cardPopup,
  ]);

  //==========================================================================//

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //==========================================================================//

  useEffect(() => {
    setIsMobileSized(window.innerWidth <= 650);
  }, [windowWidth]);

  /* ========================================================================== */
  /* =                            API FUNCTIONS                               = */
  /* ========================================================================== */

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  }

  // ========================================================================== //

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        closeAllPopups();
        setCards((state) =>
          state.filter((currentCard) => currentCard._id !== card._id)
        );
      })

      .catch((err) => {
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // ========================================================================== //

  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api
      .updateUserInfo({ name, about })
      .then((userData) => {
        setCurrentUser({ ...currentUser, ...userData });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // ========================================================================== //

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api
      .updateAvatar(avatar)
      .then((userData) => {
        setCurrentUser({ ...currentUser, ...userData });
        closeAllPopups();
      })

      .catch((err) => {
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // ========================================================================== //

  function handleAddPlaceSubmit(newPlace) {
    setIsLoading(true);
    api
      .createCard(newPlace)
      .then((newPlace) => {
        setCards([newPlace, ...cards]);
        closeAllPopups();
      })

      .catch((err) => {
        console.log(`Error: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // ========================================================================== //

  function handleRegisterSubmit({ email, password }) {
    setIsLoading(true);
    auth
      .register({ email, password })
      .then((res) => {
        if (res) {
          setIsAuthOkPopupOpen(true);
          navigate('/signin');
        }
      })
      .catch((err) => {
        setIsAuthErrorPopupOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // ========================================================================== //

  function handleLogin({ email, password }) {
    setIsLoading(true);
    auth
      .authorize({ email, password })
      .then((user) => {
        localStorage.setItem('jwt', user.token);
        setIsLoggedIn(true);
        setCurrentUser({ ...currentUser, email });
        navigate('/');
      })
      .catch((err) => {
        setIsAuthErrorPopupOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // ========================================================================== //

  function handleLogout() {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    setIsUserDetailsOpen(false);
  }

  /* ========================================================================== */
  /* =                            FUNCTIONS                                   = */
  /* ========================================================================== */

  function handleEditProfileClick() {
    setIsEditProfileOpen(true);
  }

  // ========================================================================== //

  function handleAddPlaceClick() {
    setIsAddPlaceOpen(true);
  }

  // ========================================================================== //

  function handleEditAvatarClick() {
    setIsEditAvatarOpen(true);
  }

  // ========================================================================== //

  function handleConfirmClick(card) {
    setSelectedToDeleteCard(card);
    setIsConfirmDeletePopupOpen(true);
  }

  // ========================================================================== //

  function handleCardClick(card) {
    setCardPopup(card);
  }

  // ========================================================================== //

  function handleHamburgerClick() {
    setIsUserDetailsOpen(!isUserDetailsOpen);
  }

  //==========================================================================//

  function closeAllPopups() {
    setIsEditProfileOpen(false);
    setIsAddPlaceOpen(false);
    setIsEditAvatarOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setCardPopup(null);
    setIsAuthErrorPopupOpen(false);
    setIsAuthOkPopupOpen(false);
  }

  /* ========================================================================== */
  /* =                             ROOT COMPONENT                             = */
  /* ========================================================================== */

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <InfoTooltip
          isOpen={isAuthOkPopupOpen}
          onClose={closeAllPopups}
          isSuccessful={true}
          onPopupClick={handlePopupClick}
        />

        <InfoTooltip
          isOpen={isAuthErrorPopupOpen}
          onClose={closeAllPopups}
          isSuccessful={false}
          onPopupClick={handlePopupClick}
        />
        {isUserDetailsOpen && isMobileSized && (
          <UserDetails onLogout={handleLogout} />
        )}
        <Header
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          handleHamburgerClick={handleHamburgerClick}
          isDropDownOpen={isUserDetailsOpen}
          isMobileSized={isMobileSized}
        />

        <EditProfilePopup
          isOpen={isEditProfileOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onPopupClick={handlePopupClick}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onPopupClick={handlePopupClick}
        />

        <AddPlacePopup
          isOpen={isAddPlaceOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          onPopupClick={handlePopupClick}
        />

        <ConfirmDeletePopup
          isOpen={isConfirmDeletePopupOpen}
          isLoading={isLoading}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          card={selectedToDeleteCard}
          handlePopupClick={handlePopupClick}
        />

        <ImagePopup
          card={cardPopup}
          onClose={closeAllPopups}
          onPopupClick={handlePopupClick}
        />

        <Routes>
          <Route
            path="/signin"
            element={
              <Login isLoading={isLoading} onSubmit={handleLogin} isLoggedIn />
            }
          />
          <Route
            path="/signup"
            element={
              <Register
                isLoading={isLoading}
                onSubmit={handleRegisterSubmit}
                isLoggedIn
              />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectPath="/signin" isLoggedIn={isLoggedIn}>
                <Main
                  onEditProfileClick={handleEditProfileClick}
                  onAddPlaceClick={handleAddPlaceClick}
                  onEditAvatarClick={handleEditAvatarClick}
                  onConfirmDeleteClick={handleConfirmClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
