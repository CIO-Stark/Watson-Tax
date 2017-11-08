import axios from './axios';

export function getToken () {
  return localStorage.getItem('token') || false;
}

export function logout () {
    return localStorage.removeItem('token');
}

export function login (credentials) {
  return new Promise((resolve, reject) => {

    axios.post('/login', credentials)
    .then(({ data }) => {
        // setting token
        localStorage.setItem('token', data.token);
        axios.setAuthToken(data.token);
        
        resolve(data.user);
    })
    .catch(error => {
        console.log('Login: ', error);
        reject(error);
    });
  });
}