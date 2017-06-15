import jwtDecode from 'jwt-decode';
import {removeUserFromState, saveUserToState} from '../config/actions/authenticationActions'
import {getStore} from '../../base/init'

export const AUTH_TOKEN_HEADER = 'X-Auth-Token';
export const DEVICE_TOKEN_HEADER = 'X-Device-Token';
export const USER_DATA_STORAGE_KEY = 'USER_DATA_STORAGE_KEY';

export function syncSessionUserToState() {
    let sessionUser = getUserFromSession();
    getStore().dispatch(saveUserToState(sessionUser));
}

export function addUserToSession(userData) {
    sessionStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
}

export function getUserFromSession() {
    return JSON.parse(sessionStorage.getItem(USER_DATA_STORAGE_KEY));
}

export function removeUserFromSession() {
    sessionStorage.removeItem(AUTH_TOKEN_HEADER);
}

export function logout() {
    getStore().dispatch(removeUserFromState());
    removeUserFromSession()
}

export function requireAuthUser(nextState, replace) {
    // look for token in session
    let token = sessionStorage.getItem(AUTH_TOKEN_HEADER);

    // verify token exists
    if (!token) {
        logout();
        replace({
            pathname: '/login'
        });
        return;
    }

    // verify token has not expired
    let jwtData = jwtDecode(token);
    let timeDif = jwtData.exp - new Date().getTime();
    if (timeDif <= 0) {
        logout();
        replace({
            pathname: '/login'
        });
        return;
    }

    // verify token matches users
    let authUser = getUserFromSession();
    if (jwtData.userId !== authUser.id) {
        logout();
        replace({
            pathname: '/login'
        });
    }

    syncSessionUserToState();
}
