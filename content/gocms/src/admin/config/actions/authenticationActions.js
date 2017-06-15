export const SAVE_USER_TO_STATE = 'SAVE_USER_TO_STATE';
export const REMOVE_USER_FROM_STATE = 'REMOVE_USER_FROM_STATE';

export function saveUserToState(user) {
    return {
        type: SAVE_USER_TO_STATE,
        user: user,
        loggedInAt: Date.now()
    }
}

export function removeUserFromState() {
    return {
        type: REMOVE_USER_FROM_STATE
    }
}