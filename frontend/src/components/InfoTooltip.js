import successImg from '../images/success.svg';
import errorImg from '../images/error.svg';

export default function InfoTooltip(props) {
  const { isOpen, onClose, isSuccessful, onPopupClick } = props;
  return (
    <div onClick={onPopupClick} className={`popup pupup_el_info ${isOpen ? 'popup_open' : ''}`}>
      <div className="popup__container popup__container_type_info">
        <button
          className="popup__close popup__close_el_info"
          type="button"
          onClick={onClose}
        ></button>
        <img
          className="popup__auth-img"
          alt={
            isSuccessful
              ? 'V shape signifying successful process'
              : 'X shape signifying error in process'
          }
          src={isSuccessful ? successImg : errorImg}
        ></img>
        <h2 className="popup__title">
          {isSuccessful
            ? 'Success! You have now been registered.'
            : 'Oops, something went wrong! Please try again.'}
        </h2>
      </div>
    </div>
  );
}
