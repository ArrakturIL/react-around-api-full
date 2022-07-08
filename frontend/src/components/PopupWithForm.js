function PopupWithForm(props) {
  const {
    title,
    name,
    isOpen,
    onClose,
    submitButton,
    children,
    onSubmit,
    isLoading,
    loadingButton,
    handlePopupClick,
    isValid = true,
  } = props;
  const buttonClassName = `${
    !isValid ? 'edit-form__save_disabled' : ''
  } edit-form__save`;
  const popupContainerClickHandler = (e) => {
    e.stopPropagation();
  };

  return (
    <section
      onMouseDown={handlePopupClick}
      className={`popup popup_el_${name} ${isOpen ? `popup_open` : ``}`}
    >
      <div
        className="popup__container"
        onMouseDown={popupContainerClickHandler}
      >
        <button
          type="button"
          className="popup__close"
          onClick={onClose}
        ></button>

        <form
          name={name}
          className={`edit-form edit-form_el_${name}`}
          action="#"
          onSubmit={onSubmit}
        >
          <fieldset className="edit-form__input">
            <h2 className="edit-form__heading">{title}</h2>

            {children}
          </fieldset>
          <button className={buttonClassName} type="submit" disabled={!isValid}>
            {isLoading ? loadingButton : submitButton}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PopupWithForm;
