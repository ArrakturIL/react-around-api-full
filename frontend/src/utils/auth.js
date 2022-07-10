const BASE_URL =
  /*'https://api.around-the-us.students.nomoredomainssbs.ru'*/ 'http://localhost:8080';

const handleResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);

const register = (user) => {
  return fetch(`${BASE_URL}/signup`, {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`,
    },
    body: JSON.stringify({ password: user.password, email: user.email }),
  }).then(handleResponse);
};

const authorize = (user) => {
  return fetch(`${BASE_URL}/signin`, {
    method: `POST`,
    headers: {
      'Content-Type': `application/json`,
    },
    body: JSON.stringify({ password: user.password, email: user.email }),
  }).then(handleResponse);
};

const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: `GET`,
    headers: {
      'Content-Type': `application/json`,
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
};

export { register, authorize, getContent };
