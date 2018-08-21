(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("gocms/admin/components/basicComponent/BasicComponent.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicComponent = function (_React$Component) {
    (0, _inherits3.default)(BasicComponent, _React$Component);

    function BasicComponent(props) {
        (0, _classCallCheck3.default)(this, BasicComponent);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BasicComponent.__proto__ || (0, _getPrototypeOf2.default)(BasicComponent)).call(this, props));

        _this.state = {};
        return _this;
    }

    (0, _createClass3.default)(BasicComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'p',
                { className: 'basic-component' },
                'Basic Component'
            );
        }
    }]);
    return BasicComponent;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(BasicComponent);

});

require.register("gocms/admin/config/actions/authenticationActions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.saveUserToState = saveUserToState;
exports.removeUserFromState = removeUserFromState;
var SAVE_USER_TO_STATE = exports.SAVE_USER_TO_STATE = 'SAVE_USER_TO_STATE';
var REMOVE_USER_FROM_STATE = exports.REMOVE_USER_FROM_STATE = 'REMOVE_USER_FROM_STATE';

function saveUserToState(user) {
    return {
        type: SAVE_USER_TO_STATE,
        user: user,
        loggedInAt: Date.now()
    };
}

function removeUserFromState() {
    return {
        type: REMOVE_USER_FROM_STATE
    };
}

});

;require.register("gocms/admin/config/reducers/authenticationReducers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _redux = require('redux');

var _authenticationActions = require('../actions/authenticationActions');

var actions = _interopRequireWildcard(_authenticationActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function authenticationReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    switch (action.type) {
        case actions.SAVE_USER_TO_STATE:
            return (0, _extends3.default)({}, state, action.user, {
                loggedInAt: action.loggedInAt
            });
        case actions.REMOVE_USER_FROM_STATE:
            var s = (0, _extends3.default)({}, state);
            delete s['user'];
            return s;
        default:
            return state;
    }
}

var authenticationReducers = (0, _redux.combineReducers)({
    user: authenticationReducer
});

exports.default = authenticationReducers;

});

require.register("gocms/admin/config/reducers/reducers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.injectReducers = injectReducers;
exports.registeredReducers = registeredReducers;

var _reactRouterRedux = require('react-router-redux');

var _authenticationReducers = require('./authenticationReducers');

var _authenticationReducers2 = _interopRequireDefault(_authenticationReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedReducers = {};

function injectReducers(r) {
    injectedReducers = (0, _assign2.default)({}, r, injectedReducers);
}

function registeredReducers() {
    return (0, _extends3.default)({
        auth: _authenticationReducers2.default
    }, injectedReducers, {
        routing: _reactRouterRedux.routerReducer
    });
}

});

;require.register("gocms/admin/config/router/routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectAuthedRoutes = injectAuthedRoutes;
exports.registeredRoutes = registeredRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _loginPage = require('../../containers/loginPage/loginPage.routes');

var _adminPages = require('../../containers/adminPages/adminPages.routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function injectAuthedRoutes(r) {
    (0, _adminPages.injectAdminRoutes)(r);
}

function registeredRoutes() {
    console.log("routes.js");
    return _react2.default.createElement(
        Switch,
        null,
        (0, _loginPage.registeredLoginRoutes)(),
        (0, _adminPages.registeredAdminRoutes)(),
        _react2.default.createElement(_reactRouter.Route, { path: 'will-match', component: WillMatch }),
        _react2.default.createElement(_reactRouter.Route, { path: '*', component: NoMatch, status: 404 })
    );
}

//our these routes stemming out from /api/  ?


var WillMatch = function WillMatch() {
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'h3',
            null,
            'This is going to match yes yes yes'
        )
    );
};

var NoMatch = function NoMatch(_ref) {
    var location = _ref.location;
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'h3',
            null,
            'No match for ',
            _react2.default.createElement(
                'code',
                null,
                location.pathname
            )
        )
    );
};

});

require.register("gocms/admin/config/sagas.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.rootSaga = rootSaga;
exports.injectSagas = injectSagas;

var _effects = require('redux-saga/effects');

var _loginPage = require('../containers/loginPage/loginPage.sagas');

var _loginPage2 = _interopRequireDefault(_loginPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(rootSaga);

var injectedSagas = [];

function rootSaga() {
    return _regenerator2.default.wrap(function rootSaga$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return [(0, _effects.fork)(_loginPage2.default)].concat(injectedSagas);

                case 2:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this);
}

function injectSagas(s) {
    injectedSagas.push((0, _effects.fork)(s));
}

});

;require.register("gocms/admin/containers/adminPages/adminPages.routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectAdminRoutes = injectAdminRoutes;
exports.registeredAdminRoutes = registeredAdminRoutes;

var _authentication = require('../../services/authentication');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dashboardPage = require('./dashboardPage/dashboardPage.routes');

var _dashboardPage2 = _interopRequireDefault(_dashboardPage);

var _admin_tmpl = require('../../templates/admin_tmpl');

var _admin_tmpl2 = _interopRequireDefault(_admin_tmpl);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedRoutes = [];

var routes = _react2.default.createElement(
    _reactRouter.Route,
    null,
    _react2.default.createElement(_reactRouter.Redirect, { from: 'admin', to: GOCMS_LOGIN_SUCCESS_REDIRECT }),
    _react2.default.createElement(
        _reactRouter.Route,
        { path: 'admin', component: _admin_tmpl2.default, onEnter: _authentication.requireAuthUser },
        _dashboardPage2.default,
        injectedRoutes
    )
);

function injectAdminRoutes(r) {
    injectedRoutes.push(r);
}

function registeredAdminRoutes() {
    return routes;
}

});

;require.register("gocms/admin/containers/adminPages/components/mainMenu/MainMenu.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _authentication = require('../../../../services/authentication');

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicComponent = function (_React$Component) {
    (0, _inherits3.default)(BasicComponent, _React$Component);

    function BasicComponent(props) {
        (0, _classCallCheck3.default)(this, BasicComponent);

        var _this = (0, _possibleConstructorReturn3.default)(this, (BasicComponent.__proto__ || (0, _getPrototypeOf2.default)(BasicComponent)).call(this, props));

        _this.handleMenuOpenCloseClick = _this.handleMenuOpenCloseClick.bind(_this);
        _this.handleSignOut = _this.handleSignOut.bind(_this);

        _this.state = {
            menuIsOpen: true
        };
        return _this;
    }

    (0, _createClass3.default)(BasicComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'handleSignOut',
        value: function handleSignOut(e) {
            e.preventDefault();
            (0, _authentication.logout)();
            _reactRouter.browserHistory.push("/login");
        }
    }, {
        key: 'handleMenuOpenCloseClick',
        value: function handleMenuOpenCloseClick(e) {
            this.setState({ menuIsOpen: !this.state.menuIsOpen });
        }
    }, {
        key: 'render',
        value: function render() {
            // console.log("user: ", this.state.user);
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    {
                        className: "g-container g-a-main-menu-container" + (this.state.menuIsOpen ? " g-a-main-menu-container-open" : " g-a-main-menu-container-close") },
                    _react2.default.createElement(
                        'div',
                        {
                            className: "g-container g-a-main-menu-title-container" + (this.state.menuIsOpen ? " g-a-main-menu-title-container-open" : " g-a-main-menu-title-container-close") },
                        _react2.default.createElement(
                            'div',
                            { className: 'g-a-main-menu-profile-img-container' },
                            _react2.default.createElement(
                                'a',
                                { href: '', className: 'g-a-main-menu-profile-img' },
                                _react2.default.createElement('i', { className: 'gocms-icon-user' })
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'g-container-col' },
                            _react2.default.createElement(
                                'h1',
                                { className: 'g-a-main-menu-title' },
                                GOCMS_LOGIN_TITLE
                            ),
                            _react2.default.createElement(
                                'h2',
                                { className: 'g-a-main-menu-sub-title' },
                                _react2.default.createElement(
                                    'a',
                                    { className: '', href: '' },
                                    this.props.user.fullName
                                ),
                                _react2.default.createElement(
                                    'span',
                                    { className: 'g-a-main-menu-sign-out' },
                                    _react2.default.createElement(
                                        'a',
                                        { href: '', onClick: this.handleSignOut },
                                        'Sign Out'
                                    )
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'button',
                    {
                        className: "g-a-main-menu-btn" + (this.state.menuIsOpen ? " g-a-main-menu-btn-open" : " g-a-main-menu-btn-close"),
                        onClick: this.handleMenuOpenCloseClick },
                    _react2.default.createElement('i', { className: 'gocms-icon-menu' })
                )
            );
        }
    }]);
    return BasicComponent;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {
        user: state.auth.user
    };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(BasicComponent);

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.actions.js", function(exports, require, module) {
"use strict";

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.container.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DashboardPage = function (_React$Component) {
    (0, _inherits3.default)(DashboardPage, _React$Component);

    function DashboardPage(props) {
        (0, _classCallCheck3.default)(this, DashboardPage);

        var _this = (0, _possibleConstructorReturn3.default)(this, (DashboardPage.__proto__ || (0, _getPrototypeOf2.default)(DashboardPage)).call(this, props));

        _this.state = {};
        return _this;
    }

    (0, _createClass3.default)(DashboardPage, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'h1',
                null,
                'dashboard'
            );
        }
    }]);
    return DashboardPage;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(DashboardPage);

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.reducers.js", function(exports, require, module) {
// import {combineReducers} from 'redux'
// import {REQUEST_PAGE, RECEIVE_PAGE} from './home.actions';
//
//
// const initialState = {};
//
// function page(state = {
//     isFetching: false,
//     items: []
// }, action) {
//     switch (action.type) {
//         case REQUEST_PAGE:
//             return {...state, isFetching: true};
//
//         case RECEIVE_PAGE:
//             return {
//                 ...state,
//                 isFetching: false,
//                 content: action.content,
//                 lastUpdated: action.receivedAt
//             };
//         default:
//             return state
//     }
// }
//
// function pageByUri(state = initialState, action) {
//     switch (action.type) {
//         case REQUEST_PAGE:
//         case RECEIVE_PAGE:
//             return {
//                 ...state,
//                 [action.uri]: page(state[action.uri], action)
//             };
//         default:
//             return state
//     }
// }
//
// const rootReducer = combineReducers({
//     pageByUri,
// });
//
// export default rootReducer
"use strict";

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.reducers.selectors.js", function(exports, require, module) {
// import {combineReducers} from 'redux'
// import * as actions from '../../config/actions/form';
//
// function _formRequestReducer(state = {}, action) {
//     let key = action.key;
//     switch (action.type) {
//         case actions.REQUEST:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: true,
//                     requestedAt: action.requestedAt
//                 }
//             };
//         case actions.SUCCESS:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: false,
//                     receivedAt: action.receivedAt,
//                     data: action.data
//                 }
//             };
//         case actions.FAILURE:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: false,
//                     receivedAt: action.receivedAt,
//                     err: action.err
//                 }
//             };
//         default:
//             return state
//     }
// }
//
//
// const formRequestReducer = combineReducers({
//     _formRequestReducer,
// });
//
// export default formRequestReducer
"use strict";

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _dashboardPage = require('./dashboardPage.container');

var _dashboardPage2 = _interopRequireDefault(_dashboardPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createElement(
    _reactRouter.Route,
    null,
    _react2.default.createElement(_reactRouter.Route, { path: 'dashboard', component: _dashboardPage2.default })
);

});

require.register("gocms/admin/containers/adminPages/dashboardPage/dashboardPage.sagas.js", function(exports, require, module) {
// import {fork, takeEvery, put, call} from 'redux-saga/effects';
// import * as apiActions from '../../../base/actions/apiRequestActions'; // importing our action
// import {login} from '../../config/actions/authenticationActions'
// import {Post, ENDPOINTS} from '../../../base/services/api';
// import { browserHistory } from 'react-router'
//
//
// // watch for login requests
// function* watchLoginSaga() {
//     yield takeEvery(apiActions.REQUEST, handleLoginSaga); // see details what is REQUEST param below
// }
//
// function* handleLoginSaga(action) {
//     let {res, err} = yield call(Post, ENDPOINTS.login, action.data); // calling our api method
//     if (res) {
//         // push user info to store
//         yield put(login(res.json));
//         yield put(apiActions.purge(action.key));
//         browserHistory.push(GOCMS_LOGIN_SUCCESS_REDIRECT);
//     }
//     else if (err) {
//         // fetch page data based on uri
//         yield put(apiActions.failure(action.key, err));
//     }
// }
//
// export default function* loginPageSagas() {
//     yield [
//         fork(watchLoginSaga),
//     ];
// }
"use strict";

});

require.register("gocms/admin/containers/devTools/DevTools.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reduxDevtools = require('redux-devtools');

var _reduxDevtoolsLogMonitor = require('redux-devtools-log-monitor');

var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);

var _reduxDevtoolsDockMonitor = require('redux-devtools-dock-monitor');

var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// DOCS: https://github.com/gaearon/redux-devtools

// createDevTools takes a monitor and produces a DevTools component
var DevTools = (0, _reduxDevtools.createDevTools)(_react2.default.createElement(
    _reduxDevtoolsDockMonitor2.default,
    { toggleVisibilityKey: 'ctrl-h',
        changePositionKey: 'ctrl-q',
        defaultPosition: 'left' },
    _react2.default.createElement(_reduxDevtoolsLogMonitor2.default, { theme: 'tomorrow' })
));

exports.default = DevTools;

});

require.register("gocms/admin/containers/loginPage/loginPage.actions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.gocms_login = gocms_login;
var GOCMS_LOGIN = exports.GOCMS_LOGIN = 'GOCMS_LOGIN';

function gocms_login(key, data) {
    return {
        type: GOCMS_LOGIN,
        key: key,
        data: data,
        requestedAt: Date.now()
    };
}

});

;require.register("gocms/admin/containers/loginPage/loginPage.container.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

var _reactRedux = require('react-redux');

var _loginPage = require('./loginPage.actions');

var _GForm = require('../../../base/components/gForm/GForm');

var _GForm2 = _interopRequireDefault(_GForm);

var _GInput = require('../../../base/components/gForm/GInput');

var _GInput2 = _interopRequireDefault(_GInput);

var _GError = require('../../../base/components/gForm/GError');

var _GError2 = _interopRequireDefault(_GError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOGIN_FORM = "GOCMS_LOGIN_FORM";

var LoginPage = function (_React$Component) {
    (0, _inherits3.default)(LoginPage, _React$Component);

    function LoginPage(props) {
        (0, _classCallCheck3.default)(this, LoginPage);

        var _this = (0, _possibleConstructorReturn3.default)(this, (LoginPage.__proto__ || (0, _getPrototypeOf2.default)(LoginPage)).call(this, props));

        _this.state = {
            shake: false
        };
        _this.handleSubmit = _this.handleSubmit.bind(_this); //bind function once
        return _this;
    }

    (0, _createClass3.default)(LoginPage, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.err && nextProps.reqTime != this.props.reqTime) {
                this.setState({ shake: true });
            }
            if (!!nextProps.errMessage && nextProps.errMessage != this.state.errMessage) {
                this.setState({ errMessage: nextProps.errMessage });
            }
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(model) {
            this.props.gocms_login(LOGIN_FORM, model);
            this.setState({ errMessage: null });
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { className: 'g-a' },
                _react2.default.createElement(
                    'div',
                    { id: 'container-login-page' },
                    _react2.default.createElement(
                        'div',
                        { id: 'container-login-page-form', className: 'g-container-col' },
                        _react2.default.createElement(
                            'div',
                            { className: 'wrapper-login-form', noValidate: true },
                            _react2.default.createElement(
                                'div',
                                { className: 'g-container-col' },
                                _react2.default.createElement(
                                    'h1',
                                    { className: 'text-center no-padding no-margin' },
                                    GOCMS_LOGIN_TITLE
                                ),
                                _react2.default.createElement(
                                    _GForm2.default,
                                    { id: 'main-login-form', className: 'main-login-form', name: 'main-login-form',
                                        onSubmit: this.handleSubmit,
                                        submitBtn: 'Log In',
                                        submitBtnClassName: "btn-default",
                                        submitBtnShake: this.state.shake },
                                    _react2.default.createElement(_GInput2.default, { id: 'email', name: 'email', type: 'text', label: 'Email', validations: 'isEmail',
                                        validationError: 'Please enter a valid email.', required: true }),
                                    _react2.default.createElement(_GInput2.default, { id: 'password', name: 'password', type: 'password', label: 'Password',
                                        required: true })
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'g-col' },
                                    _react2.default.createElement(_GError2.default, {
                                        className: 'error-message-login',
                                        errMessage: this.state.errMessage
                                    })
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);
    return LoginPage;
}(_react2.default.Component);

function mapStateToProps(state) {
    var errMessage = void 0;
    var err = void 0;
    var reqTime = void 0;
    var req = state.api.request[LOGIN_FORM];
    if (!!req) {
        reqTime = req.receivedAt;
        if (!!req.err) {
            err = req.err;
            if (!!err.json && !!err.json.message) {
                errMessage = err.json.message;
            }
        }
    }
    return {
        reqTime: reqTime,
        err: err,
        errMessage: errMessage
    };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {
    gocms_login: _loginPage.gocms_login
})(LoginPage);

});

require.register("gocms/admin/containers/loginPage/loginPage.reducers.js", function(exports, require, module) {
// import {combineReducers} from 'redux'
// import {REQUEST_PAGE, RECEIVE_PAGE} from './home.actions';
//
//
// const initialState = {};
//
// function page(state = {
//     isFetching: false,
//     items: []
// }, action) {
//     switch (action.type) {
//         case REQUEST_PAGE:
//             return {...state, isFetching: true};
//
//         case RECEIVE_PAGE:
//             return {
//                 ...state,
//                 isFetching: false,
//                 content: action.content,
//                 lastUpdated: action.receivedAt
//             };
//         default:
//             return state
//     }
// }
//
// function pageByUri(state = initialState, action) {
//     switch (action.type) {
//         case REQUEST_PAGE:
//         case RECEIVE_PAGE:
//             return {
//                 ...state,
//                 [action.uri]: page(state[action.uri], action)
//             };
//         default:
//             return state
//     }
// }
//
// const rootReducer = combineReducers({
//     pageByUri,
// });
//
// export default rootReducer
"use strict";

});

require.register("gocms/admin/containers/loginPage/loginPage.reducers.selectors.js", function(exports, require, module) {
// import {combineReducers} from 'redux'
// import * as actions from '../../config/actions/form';
//
// function _formRequestReducer(state = {}, action) {
//     let key = action.key;
//     switch (action.type) {
//         case actions.REQUEST:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: true,
//                     requestedAt: action.requestedAt
//                 }
//             };
//         case actions.SUCCESS:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: false,
//                     receivedAt: action.receivedAt,
//                     data: action.data
//                 }
//             };
//         case actions.FAILURE:
//             return {
//                 ...state,
//                 [key]: {
//                     ...state[key],
//                     key: action.key,
//                     isFetching: false,
//                     receivedAt: action.receivedAt,
//                     err: action.err
//                 }
//             };
//         default:
//             return state
//     }
// }
//
//
// const formRequestReducer = combineReducers({
//     _formRequestReducer,
// });
//
// export default formRequestReducer
"use strict";

});

require.register("gocms/admin/containers/loginPage/loginPage.routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registeredLoginRoutes = registeredLoginRoutes;
exports.injectLoginRoutes = injectLoginRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _loginPage = require('./loginPage.container');

var _loginPage2 = _interopRequireDefault(_loginPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedRoutes = [];

var routes = _react2.default.createElement(
    _reactRouter.Route,
    null,
    injectedRoutes
);

function registeredLoginRoutes() {
    if (injectedRoutes.length != 0) {
        return routes;
    } else {
        return _react2.default.createElement(_reactRouter.Route, { path: 'login', component: _loginPage2.default });
    }
}

function injectLoginRoutes(r) {
    injectedRoutes.push(r);
}

});

;require.register("gocms/admin/containers/loginPage/loginPage.sagas.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = loginPageSagas;

var _effects = require('redux-saga/effects');

var _loginPage = require('./loginPage.actions');

var loginActions = _interopRequireWildcard(_loginPage);

var _apiRequestActions = require('../../../base/actions/apiRequestActions');

var apiActions = _interopRequireWildcard(_apiRequestActions);

var _api = require('../../../base/services/api');

var _authentication = require('../../services/authentication');

var _reactRouter = require('react-router');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(watchLoginSaga),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(handleLoginSaga),
    _marked3 = /*#__PURE__*/_regenerator2.default.mark(loginPageSagas);

// watch for login requests
function watchLoginSaga() {
    return _regenerator2.default.wrap(function watchLoginSaga$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _effects.takeEvery)(loginActions.GOCMS_LOGIN, handleLoginSaga);

                case 2:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this);
}

function handleLoginSaga(action) {
    var _ref, res, err;

    return _regenerator2.default.wrap(function handleLoginSaga$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return (0, _effects.call)(_api.Post, _api.ENDPOINTS.login, action.data);

                case 2:
                    _ref = _context2.sent;
                    res = _ref.res;
                    err = _ref.err;

                    if (!res) {
                        _context2.next = 15;
                        break;
                    }

                    _context2.next = 8;
                    return (0, _effects.call)(_authentication.addUserToSession, res.json);

                case 8:
                    _context2.next = 10;
                    return (0, _effects.call)(_authentication.syncSessionUserToState);

                case 10:
                    _context2.next = 12;
                    return (0, _effects.put)(apiActions.purge(action.key));

                case 12:
                    _reactRouter.browserHistory.push(GOCMS_LOGIN_SUCCESS_REDIRECT);
                    _context2.next = 18;
                    break;

                case 15:
                    if (!err) {
                        _context2.next = 18;
                        break;
                    }

                    _context2.next = 18;
                    return (0, _effects.put)(apiActions.failure(action.key, err));

                case 18:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked2, this);
}

function loginPageSagas() {
    return _regenerator2.default.wrap(function loginPageSagas$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.next = 2;
                    return [(0, _effects.fork)(watchLoginSaga)];

                case 2:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked3, this);
}

});

;require.register("gocms/admin/init.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getModule = getModule;
exports.injectModule = injectModule;

var _sagas = require('./config/sagas');

var _routes = require('./config/router/routes');

var _reducers = require('./config/reducers/reducers');

var _loginPage = require('./containers/loginPage/loginPage.routes');

function getModule() {
    return {
        name: "goCMS Admin",
        sagas: _sagas.rootSaga,
        routes: (0, _routes.registeredRoutes)(),
        reducers: (0, _reducers.registeredReducers)()
    };
};

function injectModule(a) {
    (0, _sagas.injectSagas)(a.sagas);
    (0, _routes.injectAuthedRoutes)(a.routes);
    (0, _reducers.injectReducers)(a.reducers);

    // if not null inject custom login route
    if (a.loginRoutes != "" && a.loginRoutes != null && a.loginRoutes != [] && a.loginRoutes != {}) {
        (0, _loginPage.injectLoginRoutes)(a.loginRoutes);
    }
}

});

;require.register("gocms/admin/services/authentication.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.USER_DATA_STORAGE_KEY = exports.DEVICE_TOKEN_HEADER = exports.AUTH_TOKEN_HEADER = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.syncSessionUserToState = syncSessionUserToState;
exports.addUserToSession = addUserToSession;
exports.getUserFromSession = getUserFromSession;
exports.removeUserFromSession = removeUserFromSession;
exports.logout = logout;
exports.requireAuthUser = requireAuthUser;

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

var _authenticationActions = require('../config/actions/authenticationActions');

var _init = require('../../base/init');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AUTH_TOKEN_HEADER = exports.AUTH_TOKEN_HEADER = 'X-Auth-Token';
var DEVICE_TOKEN_HEADER = exports.DEVICE_TOKEN_HEADER = 'X-Device-Token';
var USER_DATA_STORAGE_KEY = exports.USER_DATA_STORAGE_KEY = 'USER_DATA_STORAGE_KEY';

function syncSessionUserToState() {
    var sessionUser = getUserFromSession();
    (0, _init.getStore)().dispatch((0, _authenticationActions.saveUserToState)(sessionUser));
}

function addUserToSession(userData) {
    sessionStorage.setItem(USER_DATA_STORAGE_KEY, (0, _stringify2.default)(userData));
}

function getUserFromSession() {
    return JSON.parse(sessionStorage.getItem(USER_DATA_STORAGE_KEY));
}

function removeUserFromSession() {
    sessionStorage.removeItem(AUTH_TOKEN_HEADER);
}

function logout() {
    (0, _init.getStore)().dispatch((0, _authenticationActions.removeUserFromState)());
    removeUserFromSession();
}

function requireAuthUser(nextState, replace) {
    // look for token in session
    var token = sessionStorage.getItem(AUTH_TOKEN_HEADER);

    // verify token exists
    if (!token) {
        logout();
        replace({
            pathname: '/login'
        });
        return;
    }

    // verify token has not expired
    var jwtData = (0, _jwtDecode2.default)(token);
    var timeDif = jwtData.exp - new Date().getTime();
    if (timeDif <= 0) {
        logout();
        replace({
            pathname: '/login'
        });
        return;
    }

    // verify token matches users
    var authUser = getUserFromSession();
    if (jwtData.userId !== authUser.id) {
        logout();
        replace({
            pathname: '/login'
        });
    }

    syncSessionUserToState();
}

});

;require.register("gocms/admin/templates/admin_tmpl.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _MainMenu = require('../containers/adminPages/components/mainMenu/MainMenu');

var _MainMenu2 = _interopRequireDefault(_MainMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdminTemplate = function (_React$Component) {
    (0, _inherits3.default)(AdminTemplate, _React$Component);

    function AdminTemplate(props) {
        (0, _classCallCheck3.default)(this, AdminTemplate);
        return (0, _possibleConstructorReturn3.default)(this, (AdminTemplate.__proto__ || (0, _getPrototypeOf2.default)(AdminTemplate)).call(this, props));
    }

    (0, _createClass3.default)(AdminTemplate, [{
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'g-a' },
                _react2.default.createElement(_MainMenu2.default, null),
                _react2.default.createElement(
                    'div',
                    { id: 'g-a-main-container' },
                    this.props.children
                )
            );
        }
    }]);
    return AdminTemplate;
}(_react2.default.Component);

AdminTemplate.propTypes = {
    children: _react.PropTypes.node
};

function mapStateToProps(state, ownProps) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(AdminTemplate);

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluL2NvbXBvbmVudHMvYmFzaWNDb21wb25lbnQvQmFzaWNDb21wb25lbnQuanMiLCJhZG1pbi9jb25maWcvYWN0aW9ucy9hdXRoZW50aWNhdGlvbkFjdGlvbnMuanMiLCJhZG1pbi9jb25maWcvcmVkdWNlcnMvYXV0aGVudGljYXRpb25SZWR1Y2Vycy5qcyIsImFkbWluL2NvbmZpZy9yZWR1Y2Vycy9yZWR1Y2Vycy5qcyIsImFkbWluL2NvbmZpZy9yb3V0ZXIvcm91dGVzLmpzIiwiYWRtaW4vY29uZmlnL3NhZ2FzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2FkbWluUGFnZXMucm91dGVzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2NvbXBvbmVudHMvbWFpbk1lbnUvTWFpbk1lbnUuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLmFjdGlvbnMuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLmNvbnRhaW5lci5qcyIsImFkbWluL2NvbnRhaW5lcnMvYWRtaW5QYWdlcy9kYXNoYm9hcmRQYWdlL2Rhc2hib2FyZFBhZ2UucmVkdWNlcnMuanMiLCJhZG1pbi9jb250YWluZXJzL2FkbWluUGFnZXMvZGFzaGJvYXJkUGFnZS9kYXNoYm9hcmRQYWdlLnJlZHVjZXJzLnNlbGVjdG9ycy5qcyIsImFkbWluL2NvbnRhaW5lcnMvYWRtaW5QYWdlcy9kYXNoYm9hcmRQYWdlL2Rhc2hib2FyZFBhZ2Uucm91dGVzLmpzIiwiYWRtaW4vY29udGFpbmVycy9hZG1pblBhZ2VzL2Rhc2hib2FyZFBhZ2UvZGFzaGJvYXJkUGFnZS5zYWdhcy5qcyIsImFkbWluL2NvbnRhaW5lcnMvZGV2VG9vbHMvRGV2VG9vbHMuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UuYWN0aW9ucy5qcyIsImFkbWluL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5jb250YWluZXIuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UucmVkdWNlcnMuanMiLCJhZG1pbi9jb250YWluZXJzL2xvZ2luUGFnZS9sb2dpblBhZ2UucmVkdWNlcnMuc2VsZWN0b3JzLmpzIiwiYWRtaW4vY29udGFpbmVycy9sb2dpblBhZ2UvbG9naW5QYWdlLnJvdXRlcy5qcyIsImFkbWluL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5zYWdhcy5qcyIsImFkbWluL2luaXQuanMiLCJhZG1pbi9zZXJ2aWNlcy9hdXRoZW50aWNhdGlvbi5qcyIsImFkbWluL3RlbXBsYXRlcy9hZG1pbl90bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbkVBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZCQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBM0NBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXRDQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwRUE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBNUNBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQS9DQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEvSUE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBM0VBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBN0NBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxEQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2QkE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBaENBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsQ0E7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhCQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBektBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBN0NBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxEQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZDQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBekhBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5DQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF6RkE7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTVFQTtBQUFBIiwiZmlsZSI6Ii4uL2FkbWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBCYXNpY0NvbXBvbmVudCA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoQmFzaWNDb21wb25lbnQsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gQmFzaWNDb21wb25lbnQocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgQmFzaWNDb21wb25lbnQpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9ICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKEJhc2ljQ29tcG9uZW50Ll9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCkpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHt9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoQmFzaWNDb21wb25lbnQsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ3AnLFxuICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnYmFzaWMtY29tcG9uZW50JyB9LFxuICAgICAgICAgICAgICAgICdCYXNpYyBDb21wb25lbnQnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBCYXNpY0NvbXBvbmVudDtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuICAgIHJldHVybiB7fTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywge30pKEJhc2ljQ29tcG9uZW50KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5zYXZlVXNlclRvU3RhdGUgPSBzYXZlVXNlclRvU3RhdGU7XG5leHBvcnRzLnJlbW92ZVVzZXJGcm9tU3RhdGUgPSByZW1vdmVVc2VyRnJvbVN0YXRlO1xudmFyIFNBVkVfVVNFUl9UT19TVEFURSA9IGV4cG9ydHMuU0FWRV9VU0VSX1RPX1NUQVRFID0gJ1NBVkVfVVNFUl9UT19TVEFURSc7XG52YXIgUkVNT1ZFX1VTRVJfRlJPTV9TVEFURSA9IGV4cG9ydHMuUkVNT1ZFX1VTRVJfRlJPTV9TVEFURSA9ICdSRU1PVkVfVVNFUl9GUk9NX1NUQVRFJztcblxuZnVuY3Rpb24gc2F2ZVVzZXJUb1N0YXRlKHVzZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBTQVZFX1VTRVJfVE9fU1RBVEUsXG4gICAgICAgIHVzZXI6IHVzZXIsXG4gICAgICAgIGxvZ2dlZEluQXQ6IERhdGUubm93KClcbiAgICB9O1xufVxuXG5mdW5jdGlvbiByZW1vdmVVc2VyRnJvbVN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFJFTU9WRV9VU0VSX0ZST01fU1RBVEVcbiAgICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvZXh0ZW5kcycpO1xuXG52YXIgX2V4dGVuZHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXh0ZW5kczIpO1xuXG52YXIgX3JlZHV4ID0gcmVxdWlyZSgncmVkdXgnKTtcblxudmFyIF9hdXRoZW50aWNhdGlvbkFjdGlvbnMgPSByZXF1aXJlKCcuLi9hY3Rpb25zL2F1dGhlbnRpY2F0aW9uQWN0aW9ucycpO1xuXG52YXIgYWN0aW9ucyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9hdXRoZW50aWNhdGlvbkFjdGlvbnMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBhdXRoZW50aWNhdGlvblJlZHVjZXIoKSB7XG4gICAgdmFyIHN0YXRlID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICB2YXIgYWN0aW9uID0gYXJndW1lbnRzWzFdO1xuXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIGFjdGlvbnMuU0FWRV9VU0VSX1RPX1NUQVRFOlxuICAgICAgICAgICAgcmV0dXJuICgwLCBfZXh0ZW5kczMuZGVmYXVsdCkoe30sIHN0YXRlLCBhY3Rpb24udXNlciwge1xuICAgICAgICAgICAgICAgIGxvZ2dlZEluQXQ6IGFjdGlvbi5sb2dnZWRJbkF0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgY2FzZSBhY3Rpb25zLlJFTU9WRV9VU0VSX0ZST01fU1RBVEU6XG4gICAgICAgICAgICB2YXIgcyA9ICgwLCBfZXh0ZW5kczMuZGVmYXVsdCkoe30sIHN0YXRlKTtcbiAgICAgICAgICAgIGRlbGV0ZSBzWyd1c2VyJ107XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG5cbnZhciBhdXRoZW50aWNhdGlvblJlZHVjZXJzID0gKDAsIF9yZWR1eC5jb21iaW5lUmVkdWNlcnMpKHtcbiAgICB1c2VyOiBhdXRoZW50aWNhdGlvblJlZHVjZXJcbn0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBhdXRoZW50aWNhdGlvblJlZHVjZXJzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvZXh0ZW5kcycpO1xuXG52YXIgX2V4dGVuZHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXh0ZW5kczIpO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvYXNzaWduJyk7XG5cbnZhciBfYXNzaWduMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Fzc2lnbik7XG5cbmV4cG9ydHMuaW5qZWN0UmVkdWNlcnMgPSBpbmplY3RSZWR1Y2VycztcbmV4cG9ydHMucmVnaXN0ZXJlZFJlZHVjZXJzID0gcmVnaXN0ZXJlZFJlZHVjZXJzO1xuXG52YXIgX3JlYWN0Um91dGVyUmVkdXggPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXItcmVkdXgnKTtcblxudmFyIF9hdXRoZW50aWNhdGlvblJlZHVjZXJzID0gcmVxdWlyZSgnLi9hdXRoZW50aWNhdGlvblJlZHVjZXJzJyk7XG5cbnZhciBfYXV0aGVudGljYXRpb25SZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hdXRoZW50aWNhdGlvblJlZHVjZXJzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGluamVjdGVkUmVkdWNlcnMgPSB7fTtcblxuZnVuY3Rpb24gaW5qZWN0UmVkdWNlcnMocikge1xuICAgIGluamVjdGVkUmVkdWNlcnMgPSAoMCwgX2Fzc2lnbjIuZGVmYXVsdCkoe30sIHIsIGluamVjdGVkUmVkdWNlcnMpO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlcmVkUmVkdWNlcnMoKSB7XG4gICAgcmV0dXJuICgwLCBfZXh0ZW5kczMuZGVmYXVsdCkoe1xuICAgICAgICBhdXRoOiBfYXV0aGVudGljYXRpb25SZWR1Y2VyczIuZGVmYXVsdFxuICAgIH0sIGluamVjdGVkUmVkdWNlcnMsIHtcbiAgICAgICAgcm91dGluZzogX3JlYWN0Um91dGVyUmVkdXgucm91dGVyUmVkdWNlclxuICAgIH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmluamVjdEF1dGhlZFJvdXRlcyA9IGluamVjdEF1dGhlZFJvdXRlcztcbmV4cG9ydHMucmVnaXN0ZXJlZFJvdXRlcyA9IHJlZ2lzdGVyZWRSb3V0ZXM7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xuXG52YXIgX2xvZ2luUGFnZSA9IHJlcXVpcmUoJy4uLy4uL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5yb3V0ZXMnKTtcblxudmFyIF9hZG1pblBhZ2VzID0gcmVxdWlyZSgnLi4vLi4vY29udGFpbmVycy9hZG1pblBhZ2VzL2FkbWluUGFnZXMucm91dGVzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGluamVjdEF1dGhlZFJvdXRlcyhyKSB7XG4gICAgKDAsIF9hZG1pblBhZ2VzLmluamVjdEFkbWluUm91dGVzKShyKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJlZFJvdXRlcygpIHtcbiAgICBjb25zb2xlLmxvZyhcInJvdXRlcy5qc1wiKTtcbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFN3aXRjaCxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgKDAsIF9sb2dpblBhZ2UucmVnaXN0ZXJlZExvZ2luUm91dGVzKSgpLFxuICAgICAgICAoMCwgX2FkbWluUGFnZXMucmVnaXN0ZXJlZEFkbWluUm91dGVzKSgpLFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3RSb3V0ZXIuUm91dGUsIHsgcGF0aDogJ3dpbGwtbWF0Y2gnLCBjb21wb25lbnQ6IFdpbGxNYXRjaCB9KSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0Um91dGVyLlJvdXRlLCB7IHBhdGg6ICcqJywgY29tcG9uZW50OiBOb01hdGNoLCBzdGF0dXM6IDQwNCB9KVxuICAgICk7XG59XG5cbi8vb3VyIHRoZXNlIHJvdXRlcyBzdGVtbWluZyBvdXQgZnJvbSAvYXBpLyAgP1xuXG5cbnZhciBXaWxsTWF0Y2ggPSBmdW5jdGlvbiBXaWxsTWF0Y2goKSB7XG4gICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAnaDMnLFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICdUaGlzIGlzIGdvaW5nIHRvIG1hdGNoIHllcyB5ZXMgeWVzJ1xuICAgICAgICApXG4gICAgKTtcbn07XG5cbnZhciBOb01hdGNoID0gZnVuY3Rpb24gTm9NYXRjaChfcmVmKSB7XG4gICAgdmFyIGxvY2F0aW9uID0gX3JlZi5sb2NhdGlvbjtcbiAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICBudWxsLFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICdoMycsXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJ05vIG1hdGNoIGZvciAnLFxuICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2NvZGUnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucGF0aG5hbWVcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVnZW5lcmF0b3IgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yJyk7XG5cbnZhciBfcmVnZW5lcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVnZW5lcmF0b3IpO1xuXG5leHBvcnRzLnJvb3RTYWdhID0gcm9vdFNhZ2E7XG5leHBvcnRzLmluamVjdFNhZ2FzID0gaW5qZWN0U2FnYXM7XG5cbnZhciBfZWZmZWN0cyA9IHJlcXVpcmUoJ3JlZHV4LXNhZ2EvZWZmZWN0cycpO1xuXG52YXIgX2xvZ2luUGFnZSA9IHJlcXVpcmUoJy4uL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5zYWdhcycpO1xuXG52YXIgX2xvZ2luUGFnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2dpblBhZ2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgX21hcmtlZCA9IC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3IyLmRlZmF1bHQubWFyayhyb290U2FnYSk7XG5cbnZhciBpbmplY3RlZFNhZ2FzID0gW107XG5cbmZ1bmN0aW9uIHJvb3RTYWdhKCkge1xuICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQud3JhcChmdW5jdGlvbiByb290U2FnYSQoX2NvbnRleHQpIHtcbiAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2NvbnRleHQucHJldiA9IF9jb250ZXh0Lm5leHQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAyO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWygwLCBfZWZmZWN0cy5mb3JrKShfbG9naW5QYWdlMi5kZWZhdWx0KV0uY29uY2F0KGluamVjdGVkU2FnYXMpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29udGV4dC5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBfbWFya2VkLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0U2FnYXMocykge1xuICAgIGluamVjdGVkU2FnYXMucHVzaCgoMCwgX2VmZmVjdHMuZm9yaykocykpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmluamVjdEFkbWluUm91dGVzID0gaW5qZWN0QWRtaW5Sb3V0ZXM7XG5leHBvcnRzLnJlZ2lzdGVyZWRBZG1pblJvdXRlcyA9IHJlZ2lzdGVyZWRBZG1pblJvdXRlcztcblxudmFyIF9hdXRoZW50aWNhdGlvbiA9IHJlcXVpcmUoJy4uLy4uL3NlcnZpY2VzL2F1dGhlbnRpY2F0aW9uJyk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9kYXNoYm9hcmRQYWdlID0gcmVxdWlyZSgnLi9kYXNoYm9hcmRQYWdlL2Rhc2hib2FyZFBhZ2Uucm91dGVzJyk7XG5cbnZhciBfZGFzaGJvYXJkUGFnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kYXNoYm9hcmRQYWdlKTtcblxudmFyIF9hZG1pbl90bXBsID0gcmVxdWlyZSgnLi4vLi4vdGVtcGxhdGVzL2FkbWluX3RtcGwnKTtcblxudmFyIF9hZG1pbl90bXBsMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FkbWluX3RtcGwpO1xuXG52YXIgX3JlYWN0Um91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBpbmplY3RlZFJvdXRlcyA9IFtdO1xuXG52YXIgcm91dGVzID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgX3JlYWN0Um91dGVyLlJvdXRlLFxuICAgIG51bGwsXG4gICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0Um91dGVyLlJlZGlyZWN0LCB7IGZyb206ICdhZG1pbicsIHRvOiBHT0NNU19MT0dJTl9TVUNDRVNTX1JFRElSRUNUIH0pLFxuICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RSb3V0ZXIuUm91dGUsXG4gICAgICAgIHsgcGF0aDogJ2FkbWluJywgY29tcG9uZW50OiBfYWRtaW5fdG1wbDIuZGVmYXVsdCwgb25FbnRlcjogX2F1dGhlbnRpY2F0aW9uLnJlcXVpcmVBdXRoVXNlciB9LFxuICAgICAgICBfZGFzaGJvYXJkUGFnZTIuZGVmYXVsdCxcbiAgICAgICAgaW5qZWN0ZWRSb3V0ZXNcbiAgICApXG4pO1xuXG5mdW5jdGlvbiBpbmplY3RBZG1pblJvdXRlcyhyKSB7XG4gICAgaW5qZWN0ZWRSb3V0ZXMucHVzaChyKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJlZEFkbWluUm91dGVzKCkge1xuICAgIHJldHVybiByb3V0ZXM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxudmFyIF9hdXRoZW50aWNhdGlvbiA9IHJlcXVpcmUoJy4uLy4uLy4uLy4uL3NlcnZpY2VzL2F1dGhlbnRpY2F0aW9uJyk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEJhc2ljQ29tcG9uZW50ID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBCYXNpY0NvbXBvbmVudChwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBCYXNpY0NvbXBvbmVudCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoQmFzaWNDb21wb25lbnQuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEJhc2ljQ29tcG9uZW50KSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLmhhbmRsZU1lbnVPcGVuQ2xvc2VDbGljayA9IF90aGlzLmhhbmRsZU1lbnVPcGVuQ2xvc2VDbGljay5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuaGFuZGxlU2lnbk91dCA9IF90aGlzLmhhbmRsZVNpZ25PdXQuYmluZChfdGhpcyk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBtZW51SXNPcGVuOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShCYXNpY0NvbXBvbmVudCwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGFuZGxlU2lnbk91dCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVTaWduT3V0KGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICgwLCBfYXV0aGVudGljYXRpb24ubG9nb3V0KSgpO1xuICAgICAgICAgICAgX3JlYWN0Um91dGVyLmJyb3dzZXJIaXN0b3J5LnB1c2goXCIvbG9naW5cIik7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRsZU1lbnVPcGVuQ2xvc2VDbGljaycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVNZW51T3BlbkNsb3NlQ2xpY2soZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1lbnVJc09wZW46ICF0aGlzLnN0YXRlLm1lbnVJc09wZW4gfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInVzZXI6IFwiLCB0aGlzLnN0YXRlLnVzZXIpO1xuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZy1jb250YWluZXIgZy1hLW1haW4tbWVudS1jb250YWluZXJcIiArICh0aGlzLnN0YXRlLm1lbnVJc09wZW4gPyBcIiBnLWEtbWFpbi1tZW51LWNvbnRhaW5lci1vcGVuXCIgOiBcIiBnLWEtbWFpbi1tZW51LWNvbnRhaW5lci1jbG9zZVwiKSB9LFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJnLWNvbnRhaW5lciBnLWEtbWFpbi1tZW51LXRpdGxlLWNvbnRhaW5lclwiICsgKHRoaXMuc3RhdGUubWVudUlzT3BlbiA/IFwiIGctYS1tYWluLW1lbnUtdGl0bGUtY29udGFpbmVyLW9wZW5cIiA6IFwiIGctYS1tYWluLW1lbnUtdGl0bGUtY29udGFpbmVyLWNsb3NlXCIpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYS1tYWluLW1lbnUtcHJvZmlsZS1pbWctY29udGFpbmVyJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHJlZjogJycsIGNsYXNzTmFtZTogJ2ctYS1tYWluLW1lbnUtcHJvZmlsZS1pbWcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdpJywgeyBjbGFzc05hbWU6ICdnb2Ntcy1pY29uLXVzZXInIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy1jb250YWluZXItY29sJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnaDEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYS1tYWluLW1lbnUtdGl0bGUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEdPQ01TX0xPR0lOX1RJVExFXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2gyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWEtbWFpbi1tZW51LXN1Yi10aXRsZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJycsIGhyZWY6ICcnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnVzZXIuZnVsbE5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYS1tYWluLW1lbnUtc2lnbi1vdXQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBocmVmOiAnJywgb25DbGljazogdGhpcy5oYW5kbGVTaWduT3V0IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1NpZ24gT3V0J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJnLWEtbWFpbi1tZW51LWJ0blwiICsgKHRoaXMuc3RhdGUubWVudUlzT3BlbiA/IFwiIGctYS1tYWluLW1lbnUtYnRuLW9wZW5cIiA6IFwiIGctYS1tYWluLW1lbnUtYnRuLWNsb3NlXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljazogdGhpcy5oYW5kbGVNZW51T3BlbkNsb3NlQ2xpY2sgfSxcbiAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2knLCB7IGNsYXNzTmFtZTogJ2dvY21zLWljb24tbWVudScgfSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBCYXNpY0NvbXBvbmVudDtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHVzZXI6IHN0YXRlLmF1dGgudXNlclxuICAgIH07XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfcmVhY3RSZWR1eC5jb25uZWN0KShtYXBTdGF0ZVRvUHJvcHMsIHt9KShCYXNpY0NvbXBvbmVudCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJyk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuJyk7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMik7XG5cbnZhciBfaW5oZXJpdHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzJyk7XG5cbnZhciBfaW5oZXJpdHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5oZXJpdHMyKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cCA9IHJlcXVpcmUoJ3JlYWN0LXRyYW5zaXRpb24tZ3JvdXAvQ1NTVHJhbnNpdGlvbkdyb3VwJyk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0NTU1RyYW5zaXRpb25Hcm91cCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBEYXNoYm9hcmRQYWdlID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShEYXNoYm9hcmRQYWdlLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIERhc2hib2FyZFBhZ2UocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgRGFzaGJvYXJkUGFnZSk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoRGFzaGJvYXJkUGFnZS5fX3Byb3RvX18gfHwgKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoRGFzaGJvYXJkUGFnZSkpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHt9O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoRGFzaGJvYXJkUGFnZSwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxNb3VudCgpIHt9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHt9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2gxJyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICdkYXNoYm9hcmQnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBEYXNoYm9hcmRQYWdlO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gICAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoRGFzaGJvYXJkUGFnZSk7XG4iLCIvLyBpbXBvcnQge2NvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnXG4vLyBpbXBvcnQge1JFUVVFU1RfUEFHRSwgUkVDRUlWRV9QQUdFfSBmcm9tICcuL2hvbWUuYWN0aW9ucyc7XG4vL1xuLy9cbi8vIGNvbnN0IGluaXRpYWxTdGF0ZSA9IHt9O1xuLy9cbi8vIGZ1bmN0aW9uIHBhZ2Uoc3RhdGUgPSB7XG4vLyAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4vLyAgICAgaXRlbXM6IFtdXG4vLyB9LCBhY3Rpb24pIHtcbi8vICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4vLyAgICAgICAgIGNhc2UgUkVRVUVTVF9QQUdFOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgaXNGZXRjaGluZzogdHJ1ZX07XG4vL1xuLy8gICAgICAgICBjYXNlIFJFQ0VJVkVfUEFHRTpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgY29udGVudDogYWN0aW9uLmNvbnRlbnQsXG4vLyAgICAgICAgICAgICAgICAgbGFzdFVwZGF0ZWQ6IGFjdGlvbi5yZWNlaXZlZEF0XG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBkZWZhdWx0OlxuLy8gICAgICAgICAgICAgcmV0dXJuIHN0YXRlXG4vLyAgICAgfVxuLy8gfVxuLy9cbi8vIGZ1bmN0aW9uIHBhZ2VCeVVyaShzdGF0ZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uKSB7XG4vLyAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuLy8gICAgICAgICBjYXNlIFJFUVVFU1RfUEFHRTpcbi8vICAgICAgICAgY2FzZSBSRUNFSVZFX1BBR0U6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIFthY3Rpb24udXJpXTogcGFnZShzdGF0ZVthY3Rpb24udXJpXSwgYWN0aW9uKVxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgZGVmYXVsdDpcbi8vICAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuLy8gICAgIH1cbi8vIH1cbi8vXG4vLyBjb25zdCByb290UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4vLyAgICAgcGFnZUJ5VXJpLFxuLy8gfSk7XG4vL1xuLy8gZXhwb3J0IGRlZmF1bHQgcm9vdFJlZHVjZXJcblwidXNlIHN0cmljdFwiO1xuIiwiLy8gaW1wb3J0IHtjb21iaW5lUmVkdWNlcnN9IGZyb20gJ3JlZHV4J1xuLy8gaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuLi8uLi9jb25maWcvYWN0aW9ucy9mb3JtJztcbi8vXG4vLyBmdW5jdGlvbiBfZm9ybVJlcXVlc3RSZWR1Y2VyKHN0YXRlID0ge30sIGFjdGlvbikge1xuLy8gICAgIGxldCBrZXkgPSBhY3Rpb24ua2V5O1xuLy8gICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbi8vICAgICAgICAgY2FzZSBhY3Rpb25zLlJFUVVFU1Q6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIFtrZXldOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIC4uLnN0YXRlW2tleV0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGtleTogYWN0aW9uLmtleSxcbi8vICAgICAgICAgICAgICAgICAgICAgaXNGZXRjaGluZzogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdGVkQXQ6IGFjdGlvbi5yZXF1ZXN0ZWRBdFxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGNhc2UgYWN0aW9ucy5TVUNDRVNTOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBba2V5XToge1xuLy8gICAgICAgICAgICAgICAgICAgICAuLi5zdGF0ZVtrZXldLFxuLy8gICAgICAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4vLyAgICAgICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICByZWNlaXZlZEF0OiBhY3Rpb24ucmVjZWl2ZWRBdCxcbi8vICAgICAgICAgICAgICAgICAgICAgZGF0YTogYWN0aW9uLmRhdGFcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBjYXNlIGFjdGlvbnMuRkFJTFVSRTpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgW2tleV06IHtcbi8vICAgICAgICAgICAgICAgICAgICAgLi4uc3RhdGVba2V5XSxcbi8vICAgICAgICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuLy8gICAgICAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZWRBdDogYWN0aW9uLnJlY2VpdmVkQXQsXG4vLyAgICAgICAgICAgICAgICAgICAgIGVycjogYWN0aW9uLmVyclxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGRlZmF1bHQ6XG4vLyAgICAgICAgICAgICByZXR1cm4gc3RhdGVcbi8vICAgICB9XG4vLyB9XG4vL1xuLy9cbi8vIGNvbnN0IGZvcm1SZXF1ZXN0UmVkdWNlciA9IGNvbWJpbmVSZWR1Y2Vycyh7XG4vLyAgICAgX2Zvcm1SZXF1ZXN0UmVkdWNlcixcbi8vIH0pO1xuLy9cbi8vIGV4cG9ydCBkZWZhdWx0IGZvcm1SZXF1ZXN0UmVkdWNlclxuXCJ1c2Ugc3RyaWN0XCI7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0Um91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbnZhciBfZGFzaGJvYXJkUGFnZSA9IHJlcXVpcmUoJy4vZGFzaGJvYXJkUGFnZS5jb250YWluZXInKTtcblxudmFyIF9kYXNoYm9hcmRQYWdlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Rhc2hib2FyZFBhZ2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICBfcmVhY3RSb3V0ZXIuUm91dGUsXG4gICAgbnVsbCxcbiAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfcmVhY3RSb3V0ZXIuUm91dGUsIHsgcGF0aDogJ2Rhc2hib2FyZCcsIGNvbXBvbmVudDogX2Rhc2hib2FyZFBhZ2UyLmRlZmF1bHQgfSlcbik7XG4iLCIvLyBpbXBvcnQge2ZvcmssIHRha2VFdmVyeSwgcHV0LCBjYWxsfSBmcm9tICdyZWR1eC1zYWdhL2VmZmVjdHMnO1xuLy8gaW1wb3J0ICogYXMgYXBpQWN0aW9ucyBmcm9tICcuLi8uLi8uLi9iYXNlL2FjdGlvbnMvYXBpUmVxdWVzdEFjdGlvbnMnOyAvLyBpbXBvcnRpbmcgb3VyIGFjdGlvblxuLy8gaW1wb3J0IHtsb2dpbn0gZnJvbSAnLi4vLi4vY29uZmlnL2FjdGlvbnMvYXV0aGVudGljYXRpb25BY3Rpb25zJ1xuLy8gaW1wb3J0IHtQb3N0LCBFTkRQT0lOVFN9IGZyb20gJy4uLy4uLy4uL2Jhc2Uvc2VydmljZXMvYXBpJztcbi8vIGltcG9ydCB7IGJyb3dzZXJIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyJ1xuLy9cbi8vXG4vLyAvLyB3YXRjaCBmb3IgbG9naW4gcmVxdWVzdHNcbi8vIGZ1bmN0aW9uKiB3YXRjaExvZ2luU2FnYSgpIHtcbi8vICAgICB5aWVsZCB0YWtlRXZlcnkoYXBpQWN0aW9ucy5SRVFVRVNULCBoYW5kbGVMb2dpblNhZ2EpOyAvLyBzZWUgZGV0YWlscyB3aGF0IGlzIFJFUVVFU1QgcGFyYW0gYmVsb3dcbi8vIH1cbi8vXG4vLyBmdW5jdGlvbiogaGFuZGxlTG9naW5TYWdhKGFjdGlvbikge1xuLy8gICAgIGxldCB7cmVzLCBlcnJ9ID0geWllbGQgY2FsbChQb3N0LCBFTkRQT0lOVFMubG9naW4sIGFjdGlvbi5kYXRhKTsgLy8gY2FsbGluZyBvdXIgYXBpIG1ldGhvZFxuLy8gICAgIGlmIChyZXMpIHtcbi8vICAgICAgICAgLy8gcHVzaCB1c2VyIGluZm8gdG8gc3RvcmVcbi8vICAgICAgICAgeWllbGQgcHV0KGxvZ2luKHJlcy5qc29uKSk7XG4vLyAgICAgICAgIHlpZWxkIHB1dChhcGlBY3Rpb25zLnB1cmdlKGFjdGlvbi5rZXkpKTtcbi8vICAgICAgICAgYnJvd3Nlckhpc3RvcnkucHVzaChHT0NNU19MT0dJTl9TVUNDRVNTX1JFRElSRUNUKTtcbi8vICAgICB9XG4vLyAgICAgZWxzZSBpZiAoZXJyKSB7XG4vLyAgICAgICAgIC8vIGZldGNoIHBhZ2UgZGF0YSBiYXNlZCBvbiB1cmlcbi8vICAgICAgICAgeWllbGQgcHV0KGFwaUFjdGlvbnMuZmFpbHVyZShhY3Rpb24ua2V5LCBlcnIpKTtcbi8vICAgICB9XG4vLyB9XG4vL1xuLy8gZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24qIGxvZ2luUGFnZVNhZ2FzKCkge1xuLy8gICAgIHlpZWxkIFtcbi8vICAgICAgICAgZm9yayh3YXRjaExvZ2luU2FnYSksXG4vLyAgICAgXTtcbi8vIH1cblwidXNlIHN0cmljdFwiO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWR1eERldnRvb2xzID0gcmVxdWlyZSgncmVkdXgtZGV2dG9vbHMnKTtcblxudmFyIF9yZWR1eERldnRvb2xzTG9nTW9uaXRvciA9IHJlcXVpcmUoJ3JlZHV4LWRldnRvb2xzLWxvZy1tb25pdG9yJyk7XG5cbnZhciBfcmVkdXhEZXZ0b29sc0xvZ01vbml0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVkdXhEZXZ0b29sc0xvZ01vbml0b3IpO1xuXG52YXIgX3JlZHV4RGV2dG9vbHNEb2NrTW9uaXRvciA9IHJlcXVpcmUoJ3JlZHV4LWRldnRvb2xzLWRvY2stbW9uaXRvcicpO1xuXG52YXIgX3JlZHV4RGV2dG9vbHNEb2NrTW9uaXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eERldnRvb2xzRG9ja01vbml0b3IpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vLyBET0NTOiBodHRwczovL2dpdGh1Yi5jb20vZ2FlYXJvbi9yZWR1eC1kZXZ0b29sc1xuXG4vLyBjcmVhdGVEZXZUb29scyB0YWtlcyBhIG1vbml0b3IgYW5kIHByb2R1Y2VzIGEgRGV2VG9vbHMgY29tcG9uZW50XG52YXIgRGV2VG9vbHMgPSAoMCwgX3JlZHV4RGV2dG9vbHMuY3JlYXRlRGV2VG9vbHMpKF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgIF9yZWR1eERldnRvb2xzRG9ja01vbml0b3IyLmRlZmF1bHQsXG4gICAgeyB0b2dnbGVWaXNpYmlsaXR5S2V5OiAnY3RybC1oJyxcbiAgICAgICAgY2hhbmdlUG9zaXRpb25LZXk6ICdjdHJsLXEnLFxuICAgICAgICBkZWZhdWx0UG9zaXRpb246ICdsZWZ0JyB9LFxuICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWR1eERldnRvb2xzTG9nTW9uaXRvcjIuZGVmYXVsdCwgeyB0aGVtZTogJ3RvbW9ycm93JyB9KVxuKSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IERldlRvb2xzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmdvY21zX2xvZ2luID0gZ29jbXNfbG9naW47XG52YXIgR09DTVNfTE9HSU4gPSBleHBvcnRzLkdPQ01TX0xPR0lOID0gJ0dPQ01TX0xPR0lOJztcblxuZnVuY3Rpb24gZ29jbXNfbG9naW4oa2V5LCBkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogR09DTVNfTE9HSU4sXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICByZXF1ZXN0ZWRBdDogRGF0ZS5ub3coKVxuICAgIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAgPSByZXF1aXJlKCdyZWFjdC10cmFuc2l0aW9uLWdyb3VwL0NTU1RyYW5zaXRpb25Hcm91cCcpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9DU1NUcmFuc2l0aW9uR3JvdXApO1xuXG52YXIgX3JlYWN0UmVkdXggPSByZXF1aXJlKCdyZWFjdC1yZWR1eCcpO1xuXG52YXIgX2xvZ2luUGFnZSA9IHJlcXVpcmUoJy4vbG9naW5QYWdlLmFjdGlvbnMnKTtcblxudmFyIF9HRm9ybSA9IHJlcXVpcmUoJy4uLy4uLy4uL2Jhc2UvY29tcG9uZW50cy9nRm9ybS9HRm9ybScpO1xuXG52YXIgX0dGb3JtMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0dGb3JtKTtcblxudmFyIF9HSW5wdXQgPSByZXF1aXJlKCcuLi8uLi8uLi9iYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR0lucHV0Jyk7XG5cbnZhciBfR0lucHV0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0dJbnB1dCk7XG5cbnZhciBfR0Vycm9yID0gcmVxdWlyZSgnLi4vLi4vLi4vYmFzZS9jb21wb25lbnRzL2dGb3JtL0dFcnJvcicpO1xuXG52YXIgX0dFcnJvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9HRXJyb3IpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgTE9HSU5fRk9STSA9IFwiR09DTVNfTE9HSU5fRk9STVwiO1xuXG52YXIgTG9naW5QYWdlID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShMb2dpblBhZ2UsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gTG9naW5QYWdlKHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIExvZ2luUGFnZSk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoTG9naW5QYWdlLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShMb2dpblBhZ2UpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBzaGFrZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgX3RoaXMuaGFuZGxlU3VibWl0ID0gX3RoaXMuaGFuZGxlU3VibWl0LmJpbmQoX3RoaXMpOyAvL2JpbmQgZnVuY3Rpb24gb25jZVxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoTG9naW5QYWdlLCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIGlmICghIW5leHRQcm9wcy5lcnIgJiYgbmV4dFByb3BzLnJlcVRpbWUgIT0gdGhpcy5wcm9wcy5yZXFUaW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNoYWtlOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCEhbmV4dFByb3BzLmVyck1lc3NhZ2UgJiYgbmV4dFByb3BzLmVyck1lc3NhZ2UgIT0gdGhpcy5zdGF0ZS5lcnJNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVyck1lc3NhZ2U6IG5leHRQcm9wcy5lcnJNZXNzYWdlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdoYW5kbGVTdWJtaXQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlU3VibWl0KG1vZGVsKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmdvY21zX2xvZ2luKExPR0lOX0ZPUk0sIG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJNZXNzYWdlOiBudWxsIH0pO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuXG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWEnIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICB7IGlkOiAnY29udGFpbmVyLWxvZ2luLXBhZ2UnIH0sXG4gICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGlkOiAnY29udGFpbmVyLWxvZ2luLXBhZ2UtZm9ybScsIGNsYXNzTmFtZTogJ2ctY29udGFpbmVyLWNvbCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnd3JhcHBlci1sb2dpbi1mb3JtJywgbm9WYWxpZGF0ZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWNvbnRhaW5lci1jb2wnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2gxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAndGV4dC1jZW50ZXIgbm8tcGFkZGluZyBuby1tYXJnaW4nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBHT0NNU19MT0dJTl9USVRMRVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9HRm9ybTIuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaWQ6ICdtYWluLWxvZ2luLWZvcm0nLCBjbGFzc05hbWU6ICdtYWluLWxvZ2luLWZvcm0nLCBuYW1lOiAnbWFpbi1sb2dpbi1mb3JtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblN1Ym1pdDogdGhpcy5oYW5kbGVTdWJtaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VibWl0QnRuOiAnTG9nIEluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJtaXRCdG5DbGFzc05hbWU6IFwiYnRuLWRlZmF1bHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJtaXRCdG5TaGFrZTogdGhpcy5zdGF0ZS5zaGFrZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0dJbnB1dDIuZGVmYXVsdCwgeyBpZDogJ2VtYWlsJywgbmFtZTogJ2VtYWlsJywgdHlwZTogJ3RleHQnLCBsYWJlbDogJ0VtYWlsJywgdmFsaWRhdGlvbnM6ICdpc0VtYWlsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uRXJyb3I6ICdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbC4nLCByZXF1aXJlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9HSW5wdXQyLmRlZmF1bHQsIHsgaWQ6ICdwYXNzd29yZCcsIG5hbWU6ICdwYXNzd29yZCcsIHR5cGU6ICdwYXNzd29yZCcsIGxhYmVsOiAnUGFzc3dvcmQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctY29sJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX0dFcnJvcjIuZGVmYXVsdCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2Vycm9yLW1lc3NhZ2UtbG9naW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyck1lc3NhZ2U6IHRoaXMuc3RhdGUuZXJyTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIExvZ2luUGFnZTtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuICAgIHZhciBlcnJNZXNzYWdlID0gdm9pZCAwO1xuICAgIHZhciBlcnIgPSB2b2lkIDA7XG4gICAgdmFyIHJlcVRpbWUgPSB2b2lkIDA7XG4gICAgdmFyIHJlcSA9IHN0YXRlLmFwaS5yZXF1ZXN0W0xPR0lOX0ZPUk1dO1xuICAgIGlmICghIXJlcSkge1xuICAgICAgICByZXFUaW1lID0gcmVxLnJlY2VpdmVkQXQ7XG4gICAgICAgIGlmICghIXJlcS5lcnIpIHtcbiAgICAgICAgICAgIGVyciA9IHJlcS5lcnI7XG4gICAgICAgICAgICBpZiAoISFlcnIuanNvbiAmJiAhIWVyci5qc29uLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICBlcnJNZXNzYWdlID0gZXJyLmpzb24ubWVzc2FnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICByZXFUaW1lOiByZXFUaW1lLFxuICAgICAgICBlcnI6IGVycixcbiAgICAgICAgZXJyTWVzc2FnZTogZXJyTWVzc2FnZVxuICAgIH07XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfcmVhY3RSZWR1eC5jb25uZWN0KShtYXBTdGF0ZVRvUHJvcHMsIHtcbiAgICBnb2Ntc19sb2dpbjogX2xvZ2luUGFnZS5nb2Ntc19sb2dpblxufSkoTG9naW5QYWdlKTtcbiIsIi8vIGltcG9ydCB7Y29tYmluZVJlZHVjZXJzfSBmcm9tICdyZWR1eCdcbi8vIGltcG9ydCB7UkVRVUVTVF9QQUdFLCBSRUNFSVZFX1BBR0V9IGZyb20gJy4vaG9tZS5hY3Rpb25zJztcbi8vXG4vL1xuLy8gY29uc3QgaW5pdGlhbFN0YXRlID0ge307XG4vL1xuLy8gZnVuY3Rpb24gcGFnZShzdGF0ZSA9IHtcbi8vICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbi8vICAgICBpdGVtczogW11cbi8vIH0sIGFjdGlvbikge1xuLy8gICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbi8vICAgICAgICAgY2FzZSBSRVFVRVNUX1BBR0U6XG4vLyAgICAgICAgICAgICByZXR1cm4gey4uLnN0YXRlLCBpc0ZldGNoaW5nOiB0cnVlfTtcbi8vXG4vLyAgICAgICAgIGNhc2UgUkVDRUlWRV9QQUdFOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgICBjb250ZW50OiBhY3Rpb24uY29udGVudCxcbi8vICAgICAgICAgICAgICAgICBsYXN0VXBkYXRlZDogYWN0aW9uLnJlY2VpdmVkQXRcbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGRlZmF1bHQ6XG4vLyAgICAgICAgICAgICByZXR1cm4gc3RhdGVcbi8vICAgICB9XG4vLyB9XG4vL1xuLy8gZnVuY3Rpb24gcGFnZUJ5VXJpKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24pIHtcbi8vICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4vLyAgICAgICAgIGNhc2UgUkVRVUVTVF9QQUdFOlxuLy8gICAgICAgICBjYXNlIFJFQ0VJVkVfUEFHRTpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgW2FjdGlvbi51cmldOiBwYWdlKHN0YXRlW2FjdGlvbi51cmldLCBhY3Rpb24pXG4vLyAgICAgICAgICAgICB9O1xuLy8gICAgICAgICBkZWZhdWx0OlxuLy8gICAgICAgICAgICAgcmV0dXJuIHN0YXRlXG4vLyAgICAgfVxuLy8gfVxuLy9cbi8vIGNvbnN0IHJvb3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcbi8vICAgICBwYWdlQnlVcmksXG4vLyB9KTtcbi8vXG4vLyBleHBvcnQgZGVmYXVsdCByb290UmVkdWNlclxuXCJ1c2Ugc3RyaWN0XCI7XG4iLCIvLyBpbXBvcnQge2NvbWJpbmVSZWR1Y2Vyc30gZnJvbSAncmVkdXgnXG4vLyBpbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4uLy4uL2NvbmZpZy9hY3Rpb25zL2Zvcm0nO1xuLy9cbi8vIGZ1bmN0aW9uIF9mb3JtUmVxdWVzdFJlZHVjZXIoc3RhdGUgPSB7fSwgYWN0aW9uKSB7XG4vLyAgICAgbGV0IGtleSA9IGFjdGlvbi5rZXk7XG4vLyAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuLy8gICAgICAgICBjYXNlIGFjdGlvbnMuUkVRVUVTVDpcbi8vICAgICAgICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICAgICAgICAgLi4uc3RhdGUsXG4vLyAgICAgICAgICAgICAgICAgW2tleV06IHtcbi8vICAgICAgICAgICAgICAgICAgICAgLi4uc3RhdGVba2V5XSxcbi8vICAgICAgICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuLy8gICAgICAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICByZXF1ZXN0ZWRBdDogYWN0aW9uLnJlcXVlc3RlZEF0XG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgY2FzZSBhY3Rpb25zLlNVQ0NFU1M6XG4vLyAgICAgICAgICAgICByZXR1cm4ge1xuLy8gICAgICAgICAgICAgICAgIC4uLnN0YXRlLFxuLy8gICAgICAgICAgICAgICAgIFtrZXldOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIC4uLnN0YXRlW2tleV0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGtleTogYWN0aW9uLmtleSxcbi8vICAgICAgICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQ6IGFjdGlvbi5yZWNlaXZlZEF0LFxuLy8gICAgICAgICAgICAgICAgICAgICBkYXRhOiBhY3Rpb24uZGF0YVxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH07XG4vLyAgICAgICAgIGNhc2UgYWN0aW9ucy5GQUlMVVJFOlxuLy8gICAgICAgICAgICAgcmV0dXJuIHtcbi8vICAgICAgICAgICAgICAgICAuLi5zdGF0ZSxcbi8vICAgICAgICAgICAgICAgICBba2V5XToge1xuLy8gICAgICAgICAgICAgICAgICAgICAuLi5zdGF0ZVtrZXldLFxuLy8gICAgICAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4vLyAgICAgICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgICAgICByZWNlaXZlZEF0OiBhY3Rpb24ucmVjZWl2ZWRBdCxcbi8vICAgICAgICAgICAgICAgICAgICAgZXJyOiBhY3Rpb24uZXJyXG4vLyAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgfTtcbi8vICAgICAgICAgZGVmYXVsdDpcbi8vICAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuLy8gICAgIH1cbi8vIH1cbi8vXG4vL1xuLy8gY29uc3QgZm9ybVJlcXVlc3RSZWR1Y2VyID0gY29tYmluZVJlZHVjZXJzKHtcbi8vICAgICBfZm9ybVJlcXVlc3RSZWR1Y2VyLFxuLy8gfSk7XG4vL1xuLy8gZXhwb3J0IGRlZmF1bHQgZm9ybVJlcXVlc3RSZWR1Y2VyXG5cInVzZSBzdHJpY3RcIjtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5yZWdpc3RlcmVkTG9naW5Sb3V0ZXMgPSByZWdpc3RlcmVkTG9naW5Sb3V0ZXM7XG5leHBvcnRzLmluamVjdExvZ2luUm91dGVzID0gaW5qZWN0TG9naW5Sb3V0ZXM7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xuXG52YXIgX2xvZ2luUGFnZSA9IHJlcXVpcmUoJy4vbG9naW5QYWdlLmNvbnRhaW5lcicpO1xuXG52YXIgX2xvZ2luUGFnZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2dpblBhZ2UpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaW5qZWN0ZWRSb3V0ZXMgPSBbXTtcblxudmFyIHJvdXRlcyA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgIF9yZWFjdFJvdXRlci5Sb3V0ZSxcbiAgICBudWxsLFxuICAgIGluamVjdGVkUm91dGVzXG4pO1xuXG5mdW5jdGlvbiByZWdpc3RlcmVkTG9naW5Sb3V0ZXMoKSB7XG4gICAgaWYgKGluamVjdGVkUm91dGVzLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHJldHVybiByb3V0ZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdFJvdXRlci5Sb3V0ZSwgeyBwYXRoOiAnbG9naW4nLCBjb21wb25lbnQ6IF9sb2dpblBhZ2UyLmRlZmF1bHQgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbmplY3RMb2dpblJvdXRlcyhyKSB7XG4gICAgaW5qZWN0ZWRSb3V0ZXMucHVzaChyKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3JlZ2VuZXJhdG9yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvcicpO1xuXG52YXIgX3JlZ2VuZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZ2VuZXJhdG9yKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gbG9naW5QYWdlU2FnYXM7XG5cbnZhciBfZWZmZWN0cyA9IHJlcXVpcmUoJ3JlZHV4LXNhZ2EvZWZmZWN0cycpO1xuXG52YXIgX2xvZ2luUGFnZSA9IHJlcXVpcmUoJy4vbG9naW5QYWdlLmFjdGlvbnMnKTtcblxudmFyIGxvZ2luQWN0aW9ucyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9sb2dpblBhZ2UpO1xuXG52YXIgX2FwaVJlcXVlc3RBY3Rpb25zID0gcmVxdWlyZSgnLi4vLi4vLi4vYmFzZS9hY3Rpb25zL2FwaVJlcXVlc3RBY3Rpb25zJyk7XG5cbnZhciBhcGlBY3Rpb25zID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2FwaVJlcXVlc3RBY3Rpb25zKTtcblxudmFyIF9hcGkgPSByZXF1aXJlKCcuLi8uLi8uLi9iYXNlL3NlcnZpY2VzL2FwaScpO1xuXG52YXIgX2F1dGhlbnRpY2F0aW9uID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvYXV0aGVudGljYXRpb24nKTtcblxudmFyIF9yZWFjdFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgX21hcmtlZCA9IC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3IyLmRlZmF1bHQubWFyayh3YXRjaExvZ2luU2FnYSksXG4gICAgX21hcmtlZDIgPSAvKiNfX1BVUkVfXyovX3JlZ2VuZXJhdG9yMi5kZWZhdWx0Lm1hcmsoaGFuZGxlTG9naW5TYWdhKSxcbiAgICBfbWFya2VkMyA9IC8qI19fUFVSRV9fKi9fcmVnZW5lcmF0b3IyLmRlZmF1bHQubWFyayhsb2dpblBhZ2VTYWdhcyk7XG5cbi8vIHdhdGNoIGZvciBsb2dpbiByZXF1ZXN0c1xuZnVuY3Rpb24gd2F0Y2hMb2dpblNhZ2EoKSB7XG4gICAgcmV0dXJuIF9yZWdlbmVyYXRvcjIuZGVmYXVsdC53cmFwKGZ1bmN0aW9uIHdhdGNoTG9naW5TYWdhJChfY29udGV4dCkge1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQubmV4dCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMudGFrZUV2ZXJ5KShsb2dpbkFjdGlvbnMuR09DTVNfTE9HSU4sIGhhbmRsZUxvZ2luU2FnYSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIF9tYXJrZWQsIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVMb2dpblNhZ2EoYWN0aW9uKSB7XG4gICAgdmFyIF9yZWYsIHJlcywgZXJyO1xuXG4gICAgcmV0dXJuIF9yZWdlbmVyYXRvcjIuZGVmYXVsdC53cmFwKGZ1bmN0aW9uIGhhbmRsZUxvZ2luU2FnYSQoX2NvbnRleHQyKSB7XG4gICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0Mi5wcmV2ID0gX2NvbnRleHQyLm5leHQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Mi5uZXh0ID0gMjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5jYWxsKShfYXBpLlBvc3QsIF9hcGkuRU5EUE9JTlRTLmxvZ2luLCBhY3Rpb24uZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIF9yZWYgPSBfY29udGV4dDIuc2VudDtcbiAgICAgICAgICAgICAgICAgICAgcmVzID0gX3JlZi5yZXM7XG4gICAgICAgICAgICAgICAgICAgIGVyciA9IF9yZWYuZXJyO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDE1O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDg7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgX2VmZmVjdHMuY2FsbCkoX2F1dGhlbnRpY2F0aW9uLmFkZFVzZXJUb1Nlc3Npb24sIHJlcy5qc29uKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxMDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5jYWxsKShfYXV0aGVudGljYXRpb24uc3luY1Nlc3Npb25Vc2VyVG9TdGF0ZSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgICAgICBfY29udGV4dDIubmV4dCA9IDEyO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDAsIF9lZmZlY3RzLnB1dCkoYXBpQWN0aW9ucy5wdXJnZShhY3Rpb24ua2V5KSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDEyOlxuICAgICAgICAgICAgICAgICAgICBfcmVhY3RSb3V0ZXIuYnJvd3Nlckhpc3RvcnkucHVzaChHT0NNU19MT0dJTl9TVUNDRVNTX1JFRElSRUNUKTtcbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxODtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDE1OlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxODtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgX2NvbnRleHQyLm5leHQgPSAxODtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBfZWZmZWN0cy5wdXQpKGFwaUFjdGlvbnMuZmFpbHVyZShhY3Rpb24ua2V5LCBlcnIpKTtcblxuICAgICAgICAgICAgICAgIGNhc2UgMTg6XG4gICAgICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0Mi5zdG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBfbWFya2VkMiwgdGhpcyk7XG59XG5cbmZ1bmN0aW9uIGxvZ2luUGFnZVNhZ2FzKCkge1xuICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQud3JhcChmdW5jdGlvbiBsb2dpblBhZ2VTYWdhcyQoX2NvbnRleHQzKSB7XG4gICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0My5wcmV2ID0gX2NvbnRleHQzLm5leHQpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIF9jb250ZXh0My5uZXh0ID0gMjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsoMCwgX2VmZmVjdHMuZm9yaykod2F0Y2hMb2dpblNhZ2EpXTtcblxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQzLnN0b3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIF9tYXJrZWQzLCB0aGlzKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5nZXRNb2R1bGUgPSBnZXRNb2R1bGU7XG5leHBvcnRzLmluamVjdE1vZHVsZSA9IGluamVjdE1vZHVsZTtcblxudmFyIF9zYWdhcyA9IHJlcXVpcmUoJy4vY29uZmlnL3NhZ2FzJyk7XG5cbnZhciBfcm91dGVzID0gcmVxdWlyZSgnLi9jb25maWcvcm91dGVyL3JvdXRlcycpO1xuXG52YXIgX3JlZHVjZXJzID0gcmVxdWlyZSgnLi9jb25maWcvcmVkdWNlcnMvcmVkdWNlcnMnKTtcblxudmFyIF9sb2dpblBhZ2UgPSByZXF1aXJlKCcuL2NvbnRhaW5lcnMvbG9naW5QYWdlL2xvZ2luUGFnZS5yb3V0ZXMnKTtcblxuZnVuY3Rpb24gZ2V0TW9kdWxlKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IFwiZ29DTVMgQWRtaW5cIixcbiAgICAgICAgc2FnYXM6IF9zYWdhcy5yb290U2FnYSxcbiAgICAgICAgcm91dGVzOiAoMCwgX3JvdXRlcy5yZWdpc3RlcmVkUm91dGVzKSgpLFxuICAgICAgICByZWR1Y2VyczogKDAsIF9yZWR1Y2Vycy5yZWdpc3RlcmVkUmVkdWNlcnMpKClcbiAgICB9O1xufTtcblxuZnVuY3Rpb24gaW5qZWN0TW9kdWxlKGEpIHtcbiAgICAoMCwgX3NhZ2FzLmluamVjdFNhZ2FzKShhLnNhZ2FzKTtcbiAgICAoMCwgX3JvdXRlcy5pbmplY3RBdXRoZWRSb3V0ZXMpKGEucm91dGVzKTtcbiAgICAoMCwgX3JlZHVjZXJzLmluamVjdFJlZHVjZXJzKShhLnJlZHVjZXJzKTtcblxuICAgIC8vIGlmIG5vdCBudWxsIGluamVjdCBjdXN0b20gbG9naW4gcm91dGVcbiAgICBpZiAoYS5sb2dpblJvdXRlcyAhPSBcIlwiICYmIGEubG9naW5Sb3V0ZXMgIT0gbnVsbCAmJiBhLmxvZ2luUm91dGVzICE9IFtdICYmIGEubG9naW5Sb3V0ZXMgIT0ge30pIHtcbiAgICAgICAgKDAsIF9sb2dpblBhZ2UuaW5qZWN0TG9naW5Sb3V0ZXMpKGEubG9naW5Sb3V0ZXMpO1xuICAgIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5VU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSBleHBvcnRzLkRFVklDRV9UT0tFTl9IRUFERVIgPSBleHBvcnRzLkFVVEhfVE9LRU5fSEVBREVSID0gdW5kZWZpbmVkO1xuXG52YXIgX3N0cmluZ2lmeSA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeScpO1xuXG52YXIgX3N0cmluZ2lmeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdpZnkpO1xuXG5leHBvcnRzLnN5bmNTZXNzaW9uVXNlclRvU3RhdGUgPSBzeW5jU2Vzc2lvblVzZXJUb1N0YXRlO1xuZXhwb3J0cy5hZGRVc2VyVG9TZXNzaW9uID0gYWRkVXNlclRvU2Vzc2lvbjtcbmV4cG9ydHMuZ2V0VXNlckZyb21TZXNzaW9uID0gZ2V0VXNlckZyb21TZXNzaW9uO1xuZXhwb3J0cy5yZW1vdmVVc2VyRnJvbVNlc3Npb24gPSByZW1vdmVVc2VyRnJvbVNlc3Npb247XG5leHBvcnRzLmxvZ291dCA9IGxvZ291dDtcbmV4cG9ydHMucmVxdWlyZUF1dGhVc2VyID0gcmVxdWlyZUF1dGhVc2VyO1xuXG52YXIgX2p3dERlY29kZSA9IHJlcXVpcmUoJ2p3dC1kZWNvZGUnKTtcblxudmFyIF9qd3REZWNvZGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfand0RGVjb2RlKTtcblxudmFyIF9hdXRoZW50aWNhdGlvbkFjdGlvbnMgPSByZXF1aXJlKCcuLi9jb25maWcvYWN0aW9ucy9hdXRoZW50aWNhdGlvbkFjdGlvbnMnKTtcblxudmFyIF9pbml0ID0gcmVxdWlyZSgnLi4vLi4vYmFzZS9pbml0Jyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBBVVRIX1RPS0VOX0hFQURFUiA9IGV4cG9ydHMuQVVUSF9UT0tFTl9IRUFERVIgPSAnWC1BdXRoLVRva2VuJztcbnZhciBERVZJQ0VfVE9LRU5fSEVBREVSID0gZXhwb3J0cy5ERVZJQ0VfVE9LRU5fSEVBREVSID0gJ1gtRGV2aWNlLVRva2VuJztcbnZhciBVU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSBleHBvcnRzLlVTRVJfREFUQV9TVE9SQUdFX0tFWSA9ICdVU0VSX0RBVEFfU1RPUkFHRV9LRVknO1xuXG5mdW5jdGlvbiBzeW5jU2Vzc2lvblVzZXJUb1N0YXRlKCkge1xuICAgIHZhciBzZXNzaW9uVXNlciA9IGdldFVzZXJGcm9tU2Vzc2lvbigpO1xuICAgICgwLCBfaW5pdC5nZXRTdG9yZSkoKS5kaXNwYXRjaCgoMCwgX2F1dGhlbnRpY2F0aW9uQWN0aW9ucy5zYXZlVXNlclRvU3RhdGUpKHNlc3Npb25Vc2VyKSk7XG59XG5cbmZ1bmN0aW9uIGFkZFVzZXJUb1Nlc3Npb24odXNlckRhdGEpIHtcbiAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFVTRVJfREFUQV9TVE9SQUdFX0tFWSwgKDAsIF9zdHJpbmdpZnkyLmRlZmF1bHQpKHVzZXJEYXRhKSk7XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJGcm9tU2Vzc2lvbigpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFVTRVJfREFUQV9TVE9SQUdFX0tFWSkpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVVc2VyRnJvbVNlc3Npb24oKSB7XG4gICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShBVVRIX1RPS0VOX0hFQURFUik7XG59XG5cbmZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAoMCwgX2luaXQuZ2V0U3RvcmUpKCkuZGlzcGF0Y2goKDAsIF9hdXRoZW50aWNhdGlvbkFjdGlvbnMucmVtb3ZlVXNlckZyb21TdGF0ZSkoKSk7XG4gICAgcmVtb3ZlVXNlckZyb21TZXNzaW9uKCk7XG59XG5cbmZ1bmN0aW9uIHJlcXVpcmVBdXRoVXNlcihuZXh0U3RhdGUsIHJlcGxhY2UpIHtcbiAgICAvLyBsb29rIGZvciB0b2tlbiBpbiBzZXNzaW9uXG4gICAgdmFyIHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShBVVRIX1RPS0VOX0hFQURFUik7XG5cbiAgICAvLyB2ZXJpZnkgdG9rZW4gZXhpc3RzXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgICBsb2dvdXQoKTtcbiAgICAgICAgcmVwbGFjZSh7XG4gICAgICAgICAgICBwYXRobmFtZTogJy9sb2dpbidcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB2ZXJpZnkgdG9rZW4gaGFzIG5vdCBleHBpcmVkXG4gICAgdmFyIGp3dERhdGEgPSAoMCwgX2p3dERlY29kZTIuZGVmYXVsdCkodG9rZW4pO1xuICAgIHZhciB0aW1lRGlmID0gand0RGF0YS5leHAgLSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBpZiAodGltZURpZiA8PSAwKSB7XG4gICAgICAgIGxvZ291dCgpO1xuICAgICAgICByZXBsYWNlKHtcbiAgICAgICAgICAgIHBhdGhuYW1lOiAnL2xvZ2luJ1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHZlcmlmeSB0b2tlbiBtYXRjaGVzIHVzZXJzXG4gICAgdmFyIGF1dGhVc2VyID0gZ2V0VXNlckZyb21TZXNzaW9uKCk7XG4gICAgaWYgKGp3dERhdGEudXNlcklkICE9PSBhdXRoVXNlci5pZCkge1xuICAgICAgICBsb2dvdXQoKTtcbiAgICAgICAgcmVwbGFjZSh7XG4gICAgICAgICAgICBwYXRobmFtZTogJy9sb2dpbidcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3luY1Nlc3Npb25Vc2VyVG9TdGF0ZSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfTWFpbk1lbnUgPSByZXF1aXJlKCcuLi9jb250YWluZXJzL2FkbWluUGFnZXMvY29tcG9uZW50cy9tYWluTWVudS9NYWluTWVudScpO1xuXG52YXIgX01haW5NZW51MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX01haW5NZW51KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEFkbWluVGVtcGxhdGUgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEFkbWluVGVtcGxhdGUsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gQWRtaW5UZW1wbGF0ZShwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBBZG1pblRlbXBsYXRlKTtcbiAgICAgICAgcmV0dXJuICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKEFkbWluVGVtcGxhdGUuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEFkbWluVGVtcGxhdGUpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoQWRtaW5UZW1wbGF0ZSwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctYScgfSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfTWFpbk1lbnUyLmRlZmF1bHQsIG51bGwpLFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2ctYS1tYWluLWNvbnRhaW5lcicgfSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEFkbWluVGVtcGxhdGU7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5BZG1pblRlbXBsYXRlLnByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogX3JlYWN0LlByb3BUeXBlcy5ub2RlXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUsIG93blByb3BzKSB7XG4gICAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoQWRtaW5UZW1wbGF0ZSk7XG4iXX0=