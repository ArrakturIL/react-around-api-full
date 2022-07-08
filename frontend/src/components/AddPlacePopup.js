import { useEffect, useState } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const { isOpen, onClose, onAddPlaceSubmit, isLoading, onPopupClick } = props;
  const [inputs, setInputs] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [errorFields, setErrorFields] = useState({});

  useEffect(() => {
    setInputs({});
    if (!isOpen) {
      setErrorFields({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const formIsValid =
        inputs.linkInput &&
        inputs.titleInput &&
        !Object.values(errorFields).some((validity) => Boolean(validity));
      setIsValid(formIsValid || false);
    
    }

  }, [errorFields, inputs, isOpen]);
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
    onAddPlaceSubmit({ name: inputs.titleInput, link: inputs.linkInput });
  };

  return (
    <PopupWithForm
      name="new-place"
      title="New place"
      submitButton="Create"
      loadingButton="Creating..."
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
          name="titleInput"
          id="title"
          type="text"
          className={`edit-form__text-input ${
            errorFields.titleInput && 'edit-form__text-input_type_error'
          }`}
          placeholder="Title"
          required
          minLength="2"
          maxLength="30"
          value={inputs.titleInput || ''}
          onChange={handleInputChange}
        />
        <span
          id="title-error"
          className={`edit-form__error ${
            !isValid && 'edit-form__error_visible'
          }`}
        >
          {errorFields.titleInput}
        </span>
      </label>
      <label className="edit-form__label">
        <input
          name="linkInput"
          id="link"
          type="url"
          className={`edit-form__text-input ${
            errorFields.linktInput && 'edit-form__text-input_type_error'
          }`}
          placeholder="Image URL"
          required
          value={inputs.linkInput || ''}
          onChange={handleInputChange}
        />
        <span
          id="link-error"
          className={`edit-form__error ${
            !isValid && 'edit-form__error_visible'
          }`}
        >
          {errorFields.linkInput}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
