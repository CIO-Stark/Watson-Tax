import axios from 'axios';
import * as auth from './auth';
import router from '../router/';

function validateStatus (status) {
    if (status === 401) {
        auth.logout();
        window.location.href = '/#/feedback';
        return false;
    }

    return true;
}

const instance = axios.create({
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    responseType: 'json',
    validateStatus: validateStatus
});

instance.__proto__.setAuthToken = token => {
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

export default instance;