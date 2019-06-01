import decode from 'jwt-decode';
import { isNullOrUndefined } from './common-service';
// import ability from '../utils/ability';

const login = async function (email, password) {
    logout();
    // Get a token from api server using the fetch api
    // const API = 'http://localhost:9999/toy_store/token';
    const API = 'http://localhost:8000/api/account/login';
    const response = await fetch(API, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({ email: email, password: password })
    });
    console.log(response);
    if (response.ok) {
        try {
            const data = await response.json();
            console.log('data   ', data);
            localStorage.setItem('id_token', data.token);
        }
        catch (exception) {
            console.log('Something wrong!!! ' + exception);
        }
        return true;
    }
    else {
        return false;
    }
};

const getToken = function () {
    return localStorage.getItem('id_token');
};

const logout = function () {
    //Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // localStorage.removeItem('role');
};

const isLoggedIn = function () {
    const token = getToken();
    return !isNullOrUndefined(token) && !isTokenExpired();
}

const isTokenExpired = function () {
    try {
        const token = getToken();
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
            logout();
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
};

const AuthService = {
    login,
    isLoggedIn,
    isTokenExpired,
    logout,
    getToken
};

export default AuthService;