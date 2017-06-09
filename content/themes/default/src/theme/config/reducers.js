import {REQUEST_PAGE, RECEIVE_PAGE} from './actions/page';
// import home from '../containers/home/home.reducers'

// function pageByUri(state = {}, action) {
//     let uri = action.uri;
//     switch (action.type) {
//         case REQUEST_PAGE:
//             return {
//                 ...state,
//                 [uri]: {
//                     ...state[uri],
//                     uri: action.uri,
//                     isFetching: true
//                 }
//             };
//
//         case RECEIVE_PAGE:
//             let content = action.content;
//             return {
//                 ...state,
//                 [uri]: {
//                     ...state[uri],
//                     isFetching: false,
//                     content: content,
//                     uri: action.uri,
//                     lastUpdated: action.receivedAt
//                 }
//             };
//         default:
//             return state
//     }
// }
//
//
// const rootReducer = {
//     // page: pageByUri,
// };
//
// export default rootReducer