import logo from "../images/logo.svg";
import HeaderNav from "./HeaderNav";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <header className="header">
      <Link to="/">
      <img className="header__logo" alt="Around the US" src={logo} />
      </Link>
      <HeaderNav {...props} />
    </header>
  );
}

export default Header;
