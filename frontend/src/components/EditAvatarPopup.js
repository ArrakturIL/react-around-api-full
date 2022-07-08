import { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  const { isOpen, onClose, onUpdateAvatar, isLoading, onPopupClick } = props;
  const [imgInput, setImgInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errorFields, setErrorFields] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setImgInput('');
      setErrorFields({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const isFormValid = Object.values(errorFields).some(
        (validity) => Boolean(validity) === false
      );
      setIsValid(isFormValid);
    }
  }, [errorFields, isValid, isOpen]);

  const handleInputChange = (e) => {
    setImgInput(e.target.value);
    setErrorFields({
      ...errorFields,
      [e.target.name]: e.target.validationMessage,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateAvatar({ avatar: imgInput });
  };

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Change avatar"
      submitButton="Save"
      loadingButton="Saving..."
      isOpen={isOpen}
      onClose={onClose}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      handlePopupClick={onPopupClick}
      isValid={isValid}
    >
      <label className="edit-form__label">
        <input
          name="avatarInput"
          id="avatar"
          type="url"
          className={`edit-form__text-input ${
            errorFields.avatarInput && 'edit-form__text-input_type_error'
          }`}
          placeholder="Avatar URL"
          required
          onChange={handleInputChange}
          value={imgInput}
        />
        <span
          id="avatar-error"
          className={`edit-form__error ${
            !isValid && 'edit-form__error_visible'
          }`}
        >
          {errorFields.avatarInput}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
