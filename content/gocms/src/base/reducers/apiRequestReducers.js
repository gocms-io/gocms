import {combineReducers} from 'redux'
import * as actions from '../actions/apiRequestActions';

function apiRequestReducer(state = {}, action) {
    let key = action.key;
    switch (action.type) {
        case actions.REQUEST:
            return {
                ...state,
                [key]: {
                    ...state[key],
                    key: action.key,
                    isFetching: true,
                    requestedAt: action.requestedAt
                }
            };
        case actions.SUCCESS:
            return {
                ...state,
                [key]: {
                    ...state[key],
                    key: action.key,
                    isFetching: false,
                    receivedAt: action.receivedAt,
                    data: action.data
                }
            };
        case actions.FAILURE:
            return {
                ...state,
                [key]: {
                    ...state[key],
                    key: action.key,
                    isFetching: false,
                    receivedAt: action.receivedAt,
                    err: action.err
                }
            };
        case actions.PURGE:
            let s = {...state};
            delete s[key];
            return s;
        default:
            return state
    }
}


const apiRequestReducers = combineReducers({
    request: apiRequestReducer,
});

export default apiRequestReducers