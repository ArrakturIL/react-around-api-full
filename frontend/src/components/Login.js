import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = (props) => {
  const { isLoggedIn, onSubmit, isLoading } = props;

  const [values, setValues] = useState({});
  const [errorFields, setErrorFields] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email: values.emailInput, password: values.passwordInput });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrorFields({
      ...errorFields,
      [e.target.name]: e.target.validationMessage,
    });
  };

  useEffect(() => {
    const areFieldsEmpty = !values.emailInput || !values.passwordInput;
    const formHasErrors = Boolean(
      errorFields.emailInput || errorFields.passwordInput
    );
    const isFormValid = !(areFieldsEmpty || formHasErrors);
    setIsValid(isFormValid);
  }, [values, errorFields]);

  useEffect(() => {
    setValues({});
    setErrorFields({});
    setIsValid(false);
  }, [isLoggedIn]);

  return (
    <div className="auth-page">
      <h1 className="auth-page__title">Log in</h1>
      <form className={`auth-page__form`} name="signin" onSubmit={handleSubmit}>
        <input
          className={`auth-page__input`}
          id="email-input"
          type="email"
          name="emailInput"
          placeholder="Email"
          value={values.emailInput || ''}
          onChange={handleChange}
          required
          minLength="2"
          maxLength="40"
        />

        <span
          className={`auth-page__input-error ${
            isValid ? '' : 'auth-page__input-error_active'
          }`}
        >
          {errorFields.emailInput}
        </span>

        <input
          className={`auth-page__input`}
          id="password-input"
          type="password"
          name="passwordInput"
          placeholder="Password"
          value={values.passwordInput || ''}
          onChange={handleChange}
          required
          minLength="4"
          maxLength="200"
        />

        <span
          className={`auth-page__input-error ${
            isValid ? '' : 'auth-page__input-error_active'
          }`}
        >
          {errorFields.passwordInput}
        </span>

        <button
           className={`auth-page__submit-btn ${
            !isValid ? 'auth-page__submit-btn_disabled' : ''
          }`}
          type="submit"
          disabled={!isValid}
        >
          {isLoading ? 'Logging you in...' : 'Log in'}
        </button>

        <div className="auth-page__info">
          <Link
            to="/signup"
            className="auth-page__link"
          >
            Not a member yet? Sign up here!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
