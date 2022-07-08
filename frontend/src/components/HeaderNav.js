import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import hamburgerIcon from '../images/hamburgerIcon.svg';
import closeIcon from '../images/Close_Icon.svg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

const HeaderNav = (props) => {
  const {
    isLoggedIn,
    handleLogout,
    handleHamburgerClick,
    isDropDownOpen,
    isMobileSized,
  } = props;
  const currenrPath = useLocation().pathname;
  const linkTo = currenrPath === '/signin' ? '/signup' : '/signin';
  const linkText = linkTo === '/signin' ? 'Log in' : 'Sign up';
  const currentUser = useContext(CurrentUserContext);

  return isMobileSized && isLoggedIn ? (
    <img
      onClick={handleHamburgerClick}
      className={
        isDropDownOpen
          ? 'header__nav-link header__nav-link_type_close'
          : 'header__nav-link'
      }
      src={isDropDownOpen ? closeIcon : hamburgerIcon}
      alt={isDropDownOpen ? 'Close icon' : 'Hamburger menu icon'}
    />
  ) : isLoggedIn ? (
    <div className="header__nav-bar">
      <span className="header__user-email">{currentUser.email}</span>
      <div className="header__nav-link" onClick={handleLogout}>
        <Link className="header__nav-link" to={'/signin'}>Log out</Link>
      </div>
    </div>
  ) : (
    <span className="header__nav-link">
      <Link className="header__nav-link" to={linkTo}>{linkText}</Link>
    </span>
  );
};

export default HeaderNav;
