import { useState, useEffect, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup(props) {
  const { isOpen, onClose, onUpdateUser, isLoading, onPopupClick } = props;

  const [inputs, setInputs] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [errorFields, setErrorFields] = useState({});
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    if (currentUser.name && currentUser.about && isOpen) {
      setInputs({
        nameInput: currentUser.name,
        aboutInput: currentUser.about,
      });
    }
  }, [currentUser, isOpen]);

  const handleInputChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
    setErrorFields({
      ...errorFields,
      [e.target.name]: e.target.validationMessage,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({ name: inputs.nameInput, about: inputs.aboutInput });
  };

  useEffect(() => {
    if (!isOpen) {
      setErrorFields({});
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen) {
      const isFormValid = !Object.values(errorFields).some((validity) =>
        Boolean(validity)
      );
      setIsValid(isFormValid);
    }
  }, [errorFields, isValid, isOpen]);

  return (
    <PopupWithForm
      name="profile"
      title="Edit profile"
      submitButton="Save"
      loadingButton="Saving..."
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      handlePopupClick={onPopupClick}
      isValid={isValid}
    >
      {' '}
      <label className="edit-form__label">
        <input
          name="nameInput"
          id="name"
          type="text"
          className={`edit-form__text-input ${
            errorFields.nameInput && 'edit-form__text-input_type_error'
          }`}
          placeholder="Name"
          required
          minLength="2"
          maxLength="40"
          value={inputs.nameInput || ''}
          onChange={handleInputChange}
        />
        <span id="name-error" className={`edit-form__error ${!isValid && 'edit-form__error_visible'}`}>
          {errorFields.nameInput}
        </span>
      </label>
      <label className="edit-form__label">
        <input
          name="aboutInput"
          id="about"
          type="text"
          className={`edit-form__text-input ${
            errorFields.aboutInput && 'edit-form__text-input_type_error'
          }`}
          placeholder="About Me"
          required
          minLength="2"
          maxLength="200"
          value={inputs.aboutInput || ''}
          onChange={handleInputChange}
        />
       <span id="name-error" className={`edit-form__error ${!isValid && 'edit-form__error_visible'}`}>
          {errorFields.aboutInput}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
