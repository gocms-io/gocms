import {combineReducers} from 'redux'
import * as actions from '../actions/authenticationActions';

function authenticationReducer(state = {}, action) {
    switch (action.type) {
        case actions.SAVE_USER_TO_STATE:
            return {
                ...state,
                ...action.user,
                loggedInAt: action.loggedInAt
            };
        case actions.REMOVE_USER_FROM_STATE:
            let s = {...state};
            delete s['user'];
            return s;
        default:
            return state
    }
}


const authenticationReducers = combineReducers({
    user: authenticationReducer,
});

export default authenticationReducers