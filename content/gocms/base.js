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
var process;
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
require.register("gocms/base/actions/apiRequestActions.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.request = request;
exports.success = success;
exports.failure = failure;
exports.purge = purge;
var REQUEST = exports.REQUEST = 'API_REQUEST';
var SUCCESS = exports.SUCCESS = 'API_SUCCESS';
var FAILURE = exports.FAILURE = 'API_FAIL';
var PURGE = exports.PURGE = 'API_PURGE';

function request(key, data) {
    return {
        type: REQUEST,
        key: key,
        data: data,
        requestedAt: Date.now()
    };
}

function success(key, data) {
    return {
        type: SUCCESS,
        key: key,
        data: data,
        receivedAt: Date.now()
    };
}

function failure(key, err) {
    return {
        type: FAILURE,
        key: key,
        err: err,
        receivedAt: Date.now()
    };
}

function purge(key) {
    return {
        type: PURGE,
        key: key
    };
}

});

;require.register("gocms/base/base_tmpl.js", function(exports, require, module) {
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

var BaseTemplate = function (_React$Component) {
    (0, _inherits3.default)(BaseTemplate, _React$Component);

    function BaseTemplate(props) {
        (0, _classCallCheck3.default)(this, BaseTemplate);
        return (0, _possibleConstructorReturn3.default)(this, (BaseTemplate.__proto__ || (0, _getPrototypeOf2.default)(BaseTemplate)).call(this, props));
    }

    (0, _createClass3.default)(BaseTemplate, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            window.addEventListener('resize', this.handleResize);

            var loaderStyle = document.getElementById("loader-page-wrapper").style;
            var appStyle = document.getElementById("app").style;
            appStyle.overflowY = "hidden";
            // wait for entire dom to finish and then fade loading screen.
            window.onload = function () {
                setTimeout(function () {
                    loaderStyle.opacity = 0;

                    // after fade start we can fade in actual site
                    setTimeout(function () {
                        appStyle.overflowY = "";
                        setTimeout(function () {
                            appStyle.opacity = 1;
                        }, 250);
                    }, 500);
                    // once loading screen is completely gone we can remove it from dom view
                    setTimeout(function () {
                        loaderStyle.display = "none";
                    }, 750);
                }, 250);
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'gocms' },
                this.props.children
            );
        }
    }]);
    return BaseTemplate;
}(_react2.default.Component);

BaseTemplate.propTypes = {
    children: _react.PropTypes.node
};

function mapStateToProps(state, ownProps) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(BaseTemplate);

});

require.register("gocms/base/components/gForm/GForm.js", function(exports, require, module) {
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

var _formsyReact = require('formsy-react');

var _formsyReact2 = _interopRequireDefault(_formsyReact);

var _GSubmit = require('./GSubmit');

var _GSubmit2 = _interopRequireDefault(_GSubmit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GForm = function (_React$Component) {
    (0, _inherits3.default)(GForm, _React$Component);

    function GForm(props) {
        (0, _classCallCheck3.default)(this, GForm);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GForm.__proto__ || (0, _getPrototypeOf2.default)(GForm)).call(this, props));

        _this.state = {
            submitButtonIsDisabled: true,
            submitBtnClassName: _this.props.submitBtnClassName || ""
        };
        _this.handleSubmit = _this.handleSubmit.bind(_this); //bind function once
        _this.disableSubmitButton = _this.disableSubmitButton.bind(_this); //bind function once
        _this.enableSubmitButton = _this.enableSubmitButton.bind(_this); //bind function once

        return _this;
    }

    (0, _createClass3.default)(GForm, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.submitBtnClassName && nextProps.submitBtnClassName != this.props.submitBtnClassName) {
                this.setState({ submitBtnClassName: nextProps.submitBtnClassName });
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'enableSubmitButton',
        value: function enableSubmitButton() {
            this.setState({ submitButtonIsDisabled: false });
        }
    }, {
        key: 'disableSubmitButton',
        value: function disableSubmitButton() {
            this.setState({ submitButtonIsDisabled: true });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(model) {
            if (!!this.props.onSubmit) {
                this.props.onSubmit(model);
            }
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                _formsyReact2.default.Form,
                {
                    id: this.props.name,
                    className: "gForm " + (this.props.className || ""),
                    name: this.props.name,
                    onSubmit: this.handleSubmit,
                    onValid: this.enableSubmitButton,
                    onInvalid: this.disableSubmitButton,
                    formNoValidate: true },
                this.props.children,
                !this.props.submitBtn ? "" : _react2.default.createElement(
                    _GSubmit2.default,
                    { type: 'submit', className: this.state.submitBtnClassName, disabled: this.state.submitButtonIsDisabled },
                    this.props.submitBtn
                )
            );
        }
    }]);
    return GForm;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(GForm);

});

require.register("gocms/base/components/gForm/GInput.js", function(exports, require, module) {
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

var _formsyReact = require('formsy-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GInput = function (_React$Component) {
    (0, _inherits3.default)(GInput, _React$Component);

    function GInput(props) {
        (0, _classCallCheck3.default)(this, GInput);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GInput.__proto__ || (0, _getPrototypeOf2.default)(GInput)).call(this, props));

        _this.state = {
            blurred: false
        };
        _this.changeValue = _this.changeValue.bind(_this);
        _this.handelBlur = _this.handelBlur.bind(_this);
        _this.enableSubmitButton = _this.changeValue.bind(_this);

        return _this;
    }

    (0, _createClass3.default)(GInput, [{
        key: 'changeValue',
        value: function changeValue(event) {
            this.props.setValue(event.currentTarget.value);
        }
    }, {
        key: 'handelBlur',
        value: function handelBlur() {
            if (!!this.props.getValue()) {
                this.setState({ blurred: true });
            } else {
                this.setState({ blurred: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var className = this.props.showRequired() ? 'g-input-required' : this.props.showError() ? 'g-input-error' : null;

            // An error message is returned ONLY if the component is invalid
            // or the server has returned an error message
            var errorMessage = [];
            if (this.state.blurred && this.props.getErrorMessage()) {
                errorMessage = this.props.getErrorMessage();
            }

            return _react2.default.createElement(
                'div',
                { className: "g-container-col g-input " + (className || "") },
                _react2.default.createElement(
                    'label',
                    { htmlFor: this.props.name },
                    this.props.label,
                    _react2.default.createElement(
                        _CSSTransitionGroup2.default,
                        { transitionName: 'g-input-error-message-animate',
                            transitionEnterTimeout: 500,
                            transitionLeaveTimeout: 500 },
                        errorMessage != "" ? _react2.default.createElement(
                            'span',
                            { className: 'g-input-error-message' },
                            errorMessage
                        ) : null
                    )
                ),
                _react2.default.createElement('input', { type: this.props.type,
                    name: this.props.name,
                    onChange: this.changeValue,
                    onBlur: this.handelBlur,
                    value: this.props.getValue() || ''
                })
            );
        }
    }]);
    return GInput;
}(_react2.default.Component);

exports.default = (0, _formsyReact.HOC)(GInput);

});

require.register("gocms/base/components/gForm/GSubmit.js", function(exports, require, module) {
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

var GSubmit = function (_React$Component) {
    (0, _inherits3.default)(GSubmit, _React$Component);

    function GSubmit(props) {
        (0, _classCallCheck3.default)(this, GSubmit);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GSubmit.__proto__ || (0, _getPrototypeOf2.default)(GSubmit)).call(this, props));

        _this.state = {
            disabled: _this.props.disabled,
            className: _this.props.className || ""
        };

        return _this;
    }

    (0, _createClass3.default)(GSubmit, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.disabled) {
                this.setState({ disabled: true });
            } else {
                this.setState({ disabled: false });
            }

            if (!!nextProps.className && nextProps.className != this.state.className) {
                this.setState({ className: nextProps.className });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'button',
                { type: 'submit', className: "btn" + (this.state.disabled ? " btn-disabled" : "") + (" " + this.state.className || ""), disabled: this.state.disabled },
                this.props.children
            );
        }
    }]);
    return GSubmit;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {})(GSubmit);

});

require.register("gocms/base/components/gForm/GTextArea.js", function(exports, require, module) {
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

var _formsyReact = require('formsy-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GTextArea = function (_React$Component) {
    (0, _inherits3.default)(GTextArea, _React$Component);

    function GTextArea(props) {
        (0, _classCallCheck3.default)(this, GTextArea);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GTextArea.__proto__ || (0, _getPrototypeOf2.default)(GTextArea)).call(this, props));

        _this.state = {
            blurred: false
        };
        _this.changeValue = _this.changeValue.bind(_this);
        _this.handelBlur = _this.handelBlur.bind(_this);
        _this.enableSubmitButton = _this.changeValue.bind(_this);

        return _this;
    }

    (0, _createClass3.default)(GTextArea, [{
        key: 'changeValue',
        value: function changeValue(event) {
            this.props.setValue(event.currentTarget.value);
        }
    }, {
        key: 'handelBlur',
        value: function handelBlur() {
            if (!!this.props.getValue()) {
                this.setState({ blurred: true });
            } else {
                this.setState({ blurred: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var className = this.props.showRequired() ? 'g-text-area-required' : this.props.showError() ? 'g-text-area-error' : null;

            // An error message is returned ONLY if the component is invalid
            // or the server has returned an error message
            var errorMessage = [];
            if (this.state.blurred && this.props.getErrorMessage()) {
                errorMessage = this.props.getErrorMessage();
            }

            return _react2.default.createElement(
                'div',
                { className: "g-container-col g-text-area " + (className || "") },
                _react2.default.createElement(
                    'label',
                    { htmlFor: this.props.name },
                    this.props.label,
                    _react2.default.createElement(
                        _CSSTransitionGroup2.default,
                        { transitionName: 'g-text-area-error-message-animate',
                            transitionEnterTimeout: 500,
                            transitionLeaveTimeout: 500 },
                        errorMessage != "" ? _react2.default.createElement(
                            'span',
                            { className: 'g-text-area-error-message' },
                            errorMessage
                        ) : null
                    )
                ),
                _react2.default.createElement('textarea', { type: this.props.type,
                    name: this.props.name,
                    onChange: this.changeValue,
                    onBlur: this.handelBlur,
                    value: this.props.getValue() || ''
                })
            );
        }
    }]);
    return GTextArea;
}(_react2.default.Component);

exports.default = (0, _formsyReact.HOC)(GTextArea);

});

require.register("gocms/base/init.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = run;
exports.getStore = getStore;
exports.injectModule = injectModule;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _sagas = require('./sagas/sagas');

var _routes = require('./router/routes');

var _reducers = require('./reducers/reducers');

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _reactRouterRedux = require('react-router-redux');

var _configureStore = require('./store/configureStore');

var _configureStore2 = _interopRequireDefault(_configureStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = null;
var history = null;
var routes = null;

// regular render
function run() {
    // init store, sagas, history, and routes
    store = (0, _configureStore2.default)(window.__INITIAL_STATE__, (0, _reducers.rootReducer)());
    store.runSaga((0, _sagas.rootSaga)(), store.dispatch);
    history = (0, _reactRouterRedux.syncHistoryWithStore)(_reactRouter.browserHistory, store);
    routes = (0, _routes.registeredRoutes)();

    // render out doc
    (0, _reactDom.render)(_react2.default.createElement(
        _reactRedux.Provider,
        { store: store },
        _react2.default.createElement(_reactRouter.Router, { onUpdate: function onUpdate() {
                return window.scrollTo(0, 0);
            }, history: history, routes: routes })
    ), document.getElementById('app'));
}

function getStore() {
    return store;
}

function injectModule(a) {
    (0, _sagas.injectSagas)(a.sagas);
    (0, _routes.injectRoutes)(a.routes);
    (0, _reducers.injectReducers)(a.reducers);
}

});

;require.register("gocms/base/reducers/apiRequestReducers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends5 = require('babel-runtime/helpers/extends');

var _extends6 = _interopRequireDefault(_extends5);

var _redux = require('redux');

var _apiRequestActions = require('../actions/apiRequestActions');

var actions = _interopRequireWildcard(_apiRequestActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function apiRequestReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    var key = action.key;
    switch (action.type) {
        case actions.REQUEST:
            return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, key, (0, _extends6.default)({}, state[key], {
                key: action.key,
                isFetching: true,
                requestedAt: action.requestedAt
            })));
        case actions.SUCCESS:
            return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, key, (0, _extends6.default)({}, state[key], {
                key: action.key,
                isFetching: false,
                receivedAt: action.receivedAt,
                data: action.data
            })));
        case actions.FAILURE:
            return (0, _extends6.default)({}, state, (0, _defineProperty3.default)({}, key, (0, _extends6.default)({}, state[key], {
                key: action.key,
                isFetching: false,
                receivedAt: action.receivedAt,
                err: action.err
            })));
        case actions.PURGE:
            var s = (0, _extends6.default)({}, state);
            delete s[key];
            return s;
        default:
            return state;
    }
}

var apiRequestReducers = (0, _redux.combineReducers)({
    request: apiRequestReducer
});

exports.default = apiRequestReducers;

});

require.register("gocms/base/reducers/reducers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.injectReducers = injectReducers;
exports.rootReducer = rootReducer;

var _reactRouterRedux = require('react-router-redux');

var _redux = require('redux');

var _apiRequestReducers = require('./apiRequestReducers');

var _apiRequestReducers2 = _interopRequireDefault(_apiRequestReducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedReducers = {};

function injectReducers(r) {
    injectedReducers = (0, _assign2.default)({}, r, injectedReducers);
}

function rootReducer() {
    return (0, _redux.combineReducers)((0, _extends3.default)({
        api: _apiRequestReducers2.default
    }, injectedReducers, {
        routing: _reactRouterRedux.routerReducer
    }));
}

});

;require.register("gocms/base/router/routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectRoutes = injectRoutes;
exports.registeredRoutes = registeredRoutes;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _base_tmpl = require('../base_tmpl');

var _base_tmpl2 = _interopRequireDefault(_base_tmpl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedRoutes = [];
var routes = _react2.default.createElement(
    _reactRouter.Route,
    { component: _base_tmpl2.default },
    injectedRoutes
);

function injectRoutes(r) {
    injectedRoutes.push(r);
}

function registeredRoutes() {
    return routes;
}

});

;require.register("gocms/base/sagas/sagas.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.rootSaga = rootSaga;
exports.injectSagas = injectSagas;

var _effects = require('redux-saga/effects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var injectedSagas = [];
var sagas = [];

function rootSaga() {
    return _regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return [].concat(injectedSagas);

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    });
}

function injectSagas(s) {
    injectedSagas.push((0, _effects.fork)(s));
}

});

;require.register("gocms/base/services/api.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ENDPOINTS = exports.USER_DATA_STORAGE_KEY = exports.DEVICE_TOKEN_HEADER = exports.AUTH_TOKEN_HEADER = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.Get = Get;
exports.Post = Post;
exports.Put = Put;
exports.Delete = Delete;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AUTH_TOKEN_HEADER = exports.AUTH_TOKEN_HEADER = 'X-Auth-Token';
var DEVICE_TOKEN_HEADER = exports.DEVICE_TOKEN_HEADER = 'X-Device-Token';
var USER_DATA_STORAGE_KEY = exports.USER_DATA_STORAGE_KEY = 'USER_DATA_STORAGE_KEY';
var ENDPOINTS = exports.ENDPOINTS = {
    login: "/api/login"
};

var defaultOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default',
    method: 'GET',
    body: null
};

var Api = function () {
    function Api(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        (0, _classCallCheck3.default)(this, Api);

        this.url = url;
        this.options = (0, _assign2.default)(defaultOptions, options);

        // add auth headers if they are present
        if (!!sessionStorage.getItem(AUTH_TOKEN_HEADER)) {
            this.options.headers[AUTH_TOKEN_HEADER] = sessionStorage.getItem(AUTH_TOKEN_HEADER);
        }
        if (!!sessionStorage.getItem(DEVICE_TOKEN_HEADER)) {
            this.options.headers[DEVICE_TOKEN_HEADER] = sessionStorage.getItem(DEVICE_TOKEN_HEADER);
        }

        this.fetch = _isomorphicFetch2.default;
    }

    (0, _createClass3.default)(Api, [{
        key: 'callApi',
        value: function callApi() {
            return this.fetch(this.url, this.options).then(function (res) {
                console.log("h");
                return res.json().then(function (json) {
                    // success
                    // todo need to rearange this so that 200 without json comes back successful
                    // todo then we need to add a success handler to the contact form so that people only submit once
                    // todo then we need to update the forms to allow for subit and error as apposed to just a disabled btn
                    if (res.status == 200 || res.status == 204) {
                        console.log("200");
                        // if we receive an auth token we should add this to the storage
                        if (res.headers.has(AUTH_TOKEN_HEADER)) {
                            sessionStorage.setItem(AUTH_TOKEN_HEADER, res.headers.get(AUTH_TOKEN_HEADER));
                        }
                        // if we receive a device token we should add this to the storage
                        if (res.headers.has(DEVICE_TOKEN_HEADER)) {
                            sessionStorage.setItem(DEVICE_TOKEN_HEADER, res.headers.get(DEVICE_TOKEN_HEADER));
                        }
                        return { status: res.status, json: json };
                    }
                    // if we have a authorization error we should delete the auth token

                    else {
                            console.log("issues");
                            switch (res.status) {
                                case 401:
                                case 403:
                                    sessionStorage.removeItem(AUTH_TOKEN_HEADER);
                                    return _promise2.default.reject({ status: res.status, json: json });
                                default:
                                    return _promise2.default.reject({ status: res.status, json: json });
                            }
                        }
                });
            }).then(function (res) {
                // success
                console.log("s");
                return { res: res };
            }, function (err) {
                //fail
                console.log("e");
                return { err: err };
            });
        }
    }]);
    return Api;
}();

exports.default = Api;
function Get(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options.method = "GET";
    return new Api(url, options).callApi();
}

function Post(url, body) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    options.method = "POST";

    // stringify body if needed
    if (!!body) {
        options.body = (0, _stringify2.default)(body);
    }
    return new Api(url, options).callApi();
}

function Put(url, body) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    options.method = "PUT";

    // stringify body if needed
    if (!!body) {
        options.body = (0, _stringify2.default)(body);
    }
    return new Api(url, options).callApi();
}

function Delete(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options.method = "Delete";
    return new Api(url, options).callApi();
}

});

;require.register("gocms/base/store/configureStore.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = configureStore;

var _redux = require('redux');

var _reduxLogger = require('redux-logger');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureStore(initialState, rootReducer) {

    var sagaMiddleware = (0, _reduxSaga2.default)();
    var logger = (0, _reduxLogger.createLogger)({
        collapsed: true
    });

    var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
    var store = (0, _redux.createStore)(rootReducer, initialState, composeEnhancers((0, _redux.applyMiddleware)(sagaMiddleware, logger)));

    store.runSaga = sagaMiddleware.run;
    store.close = function () {
        return store.dispatch(_reduxSaga.END);
    };

    return store;
}

});

;require.register("gocms/initialize.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = run;
function run(withAdmin, activePlugins, activeTheme) {

    // first get goCMS base
    var goCMSBase = require('./base/init.js');

    if (!!window.MSInputMethodContext && !!document.documentMode) {
        console.log("IE11: Loading promise polyfill");
        require('es6-promise').polyfill();
    }

    // check to see if we are loading admin section
    if (!!withAdmin) {
        var goCMSAdmin = require('./admin/init.js').default;
        goCMSBase.injectModule(goCMSAdmin);
    }

    for (var i = 0; i < activePlugins.length; i++) {
        var activePluginInit = activePlugins[i] + "/initialize.js";
        var activePlugin = require(activePluginInit).default;
        goCMSBase.injectModule(activePlugin);
    }

    // load the theme
    var themeInit = activeTheme + '/theme/initialize.js';
    var goCMSTheme = require(themeInit).default;
    goCMSBase.injectModule(goCMSTheme);

    // run the cms
    goCMSBase.run();
}

});

;require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYWN0aW9ucy9hcGlSZXF1ZXN0QWN0aW9ucy5qcyIsImJhc2UvYmFzZV90bXBsLmpzIiwiYmFzZS9jb21wb25lbnRzL2dGb3JtL0dGb3JtLmpzIiwiYmFzZS9jb21wb25lbnRzL2dGb3JtL0dJbnB1dC5qcyIsImJhc2UvY29tcG9uZW50cy9nRm9ybS9HU3VibWl0LmpzIiwiYmFzZS9jb21wb25lbnRzL2dGb3JtL0dUZXh0QXJlYS5qcyIsImJhc2UvaW5pdC5qcyIsImJhc2UvcmVkdWNlcnMvYXBpUmVxdWVzdFJlZHVjZXJzLmpzIiwiYmFzZS9yZWR1Y2Vycy9yZWR1Y2Vycy5qcyIsImJhc2Uvcm91dGVyL3JvdXRlcy5qcyIsImJhc2Uvc2FnYXMvc2FnYXMuanMiLCJiYXNlL3NlcnZpY2VzL2FwaS5qcyIsImJhc2Uvc3RvcmUvY29uZmlndXJlU3RvcmUuanMiLCJpbml0aWFsaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBL0NBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEzRkE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBMUhBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbEhBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBcEZBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbEhBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoRUE7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhFQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBeENBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsQ0E7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBekNBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFuS0E7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWxDQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXBDQTtBQUFBIiwiZmlsZSI6Ii4uL2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucmVxdWVzdCA9IHJlcXVlc3Q7XG5leHBvcnRzLnN1Y2Nlc3MgPSBzdWNjZXNzO1xuZXhwb3J0cy5mYWlsdXJlID0gZmFpbHVyZTtcbmV4cG9ydHMucHVyZ2UgPSBwdXJnZTtcbnZhciBSRVFVRVNUID0gZXhwb3J0cy5SRVFVRVNUID0gJ0FQSV9SRVFVRVNUJztcbnZhciBTVUNDRVNTID0gZXhwb3J0cy5TVUNDRVNTID0gJ0FQSV9TVUNDRVNTJztcbnZhciBGQUlMVVJFID0gZXhwb3J0cy5GQUlMVVJFID0gJ0FQSV9GQUlMJztcbnZhciBQVVJHRSA9IGV4cG9ydHMuUFVSR0UgPSAnQVBJX1BVUkdFJztcblxuZnVuY3Rpb24gcmVxdWVzdChrZXksIGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBSRVFVRVNULFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgcmVxdWVzdGVkQXQ6IERhdGUubm93KClcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBzdWNjZXNzKGtleSwgZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFNVQ0NFU1MsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICByZWNlaXZlZEF0OiBEYXRlLm5vdygpXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZmFpbHVyZShrZXksIGVycikge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IEZBSUxVUkUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBlcnI6IGVycixcbiAgICAgICAgcmVjZWl2ZWRBdDogRGF0ZS5ub3coKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHB1cmdlKGtleSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IFBVUkdFLFxuICAgICAgICBrZXk6IGtleVxuICAgIH07XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEJhc2VUZW1wbGF0ZSA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoQmFzZVRlbXBsYXRlLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEJhc2VUZW1wbGF0ZShwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBCYXNlVGVtcGxhdGUpO1xuICAgICAgICByZXR1cm4gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoQmFzZVRlbXBsYXRlLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShCYXNlVGVtcGxhdGUpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoQmFzZVRlbXBsYXRlLCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG5cbiAgICAgICAgICAgIHZhciBsb2FkZXJTdHlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZGVyLXBhZ2Utd3JhcHBlclwiKS5zdHlsZTtcbiAgICAgICAgICAgIHZhciBhcHBTdHlsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwXCIpLnN0eWxlO1xuICAgICAgICAgICAgYXBwU3R5bGUub3ZlcmZsb3dZID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIC8vIHdhaXQgZm9yIGVudGlyZSBkb20gdG8gZmluaXNoIGFuZCB0aGVuIGZhZGUgbG9hZGluZyBzY3JlZW4uXG4gICAgICAgICAgICB3aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBsb2FkZXJTdHlsZS5vcGFjaXR5ID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBhZnRlciBmYWRlIHN0YXJ0IHdlIGNhbiBmYWRlIGluIGFjdHVhbCBzaXRlXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwU3R5bGUub3ZlcmZsb3dZID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gb25jZSBsb2FkaW5nIHNjcmVlbiBpcyBjb21wbGV0ZWx5IGdvbmUgd2UgY2FuIHJlbW92ZSBpdCBmcm9tIGRvbSB2aWV3XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVyU3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICB9LCA3NTApO1xuICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgIHsgaWQ6ICdnb2NtcycgfSxcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBCYXNlVGVtcGxhdGU7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5CYXNlVGVtcGxhdGUucHJvcFR5cGVzID0ge1xuICAgIGNoaWxkcmVuOiBfcmVhY3QuUHJvcFR5cGVzLm5vZGVcbn07XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSwgb3duUHJvcHMpIHtcbiAgICByZXR1cm4ge307XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfcmVhY3RSZWR1eC5jb25uZWN0KShtYXBTdGF0ZVRvUHJvcHMsIHt9KShCYXNlVGVtcGxhdGUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfZm9ybXN5UmVhY3QgPSByZXF1aXJlKCdmb3Jtc3ktcmVhY3QnKTtcblxudmFyIF9mb3Jtc3lSZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9mb3Jtc3lSZWFjdCk7XG5cbnZhciBfR1N1Ym1pdCA9IHJlcXVpcmUoJy4vR1N1Ym1pdCcpO1xuXG52YXIgX0dTdWJtaXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfR1N1Ym1pdCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHRm9ybSA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoR0Zvcm0sIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gR0Zvcm0ocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgR0Zvcm0pO1xuXG4gICAgICAgIHZhciBfdGhpcyA9ICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKEdGb3JtLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHRm9ybSkpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHN1Ym1pdEJ1dHRvbklzRGlzYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBzdWJtaXRCdG5DbGFzc05hbWU6IF90aGlzLnByb3BzLnN1Ym1pdEJ0bkNsYXNzTmFtZSB8fCBcIlwiXG4gICAgICAgIH07XG4gICAgICAgIF90aGlzLmhhbmRsZVN1Ym1pdCA9IF90aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKF90aGlzKTsgLy9iaW5kIGZ1bmN0aW9uIG9uY2VcbiAgICAgICAgX3RoaXMuZGlzYWJsZVN1Ym1pdEJ1dHRvbiA9IF90aGlzLmRpc2FibGVTdWJtaXRCdXR0b24uYmluZChfdGhpcyk7IC8vYmluZCBmdW5jdGlvbiBvbmNlXG4gICAgICAgIF90aGlzLmVuYWJsZVN1Ym1pdEJ1dHRvbiA9IF90aGlzLmVuYWJsZVN1Ym1pdEJ1dHRvbi5iaW5kKF90aGlzKTsgLy9iaW5kIGZ1bmN0aW9uIG9uY2VcblxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoR0Zvcm0sIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIGlmICghIW5leHRQcm9wcy5zdWJtaXRCdG5DbGFzc05hbWUgJiYgbmV4dFByb3BzLnN1Ym1pdEJ0bkNsYXNzTmFtZSAhPSB0aGlzLnByb3BzLnN1Ym1pdEJ0bkNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdWJtaXRCdG5DbGFzc05hbWU6IG5leHRQcm9wcy5zdWJtaXRCdG5DbGFzc05hbWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnZW5hYmxlU3VibWl0QnV0dG9uJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZVN1Ym1pdEJ1dHRvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdWJtaXRCdXR0b25Jc0Rpc2FibGVkOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnZGlzYWJsZVN1Ym1pdEJ1dHRvbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlU3VibWl0QnV0dG9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN1Ym1pdEJ1dHRvbklzRGlzYWJsZWQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRsZVN1Ym1pdCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVTdWJtaXQobW9kZWwpIHtcbiAgICAgICAgICAgIGlmICghIXRoaXMucHJvcHMub25TdWJtaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLm9uU3VibWl0KG1vZGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcblxuICAgICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgIF9mb3Jtc3lSZWFjdDIuZGVmYXVsdC5Gb3JtLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHRoaXMucHJvcHMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiBcImdGb3JtIFwiICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lIHx8IFwiXCIpLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLnByb3BzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG9uU3VibWl0OiB0aGlzLmhhbmRsZVN1Ym1pdCxcbiAgICAgICAgICAgICAgICAgICAgb25WYWxpZDogdGhpcy5lbmFibGVTdWJtaXRCdXR0b24sXG4gICAgICAgICAgICAgICAgICAgIG9uSW52YWxpZDogdGhpcy5kaXNhYmxlU3VibWl0QnV0dG9uLFxuICAgICAgICAgICAgICAgICAgICBmb3JtTm9WYWxpZGF0ZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4sXG4gICAgICAgICAgICAgICAgIXRoaXMucHJvcHMuc3VibWl0QnRuID8gXCJcIiA6IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICBfR1N1Ym1pdDIuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3VibWl0JywgY2xhc3NOYW1lOiB0aGlzLnN0YXRlLnN1Ym1pdEJ0bkNsYXNzTmFtZSwgZGlzYWJsZWQ6IHRoaXMuc3RhdGUuc3VibWl0QnV0dG9uSXNEaXNhYmxlZCB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnN1Ym1pdEJ0blxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEdGb3JtO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlKSB7XG4gICAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoR0Zvcm0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgncmVhY3QtdHJhbnNpdGlvbi1ncm91cC9DU1NUcmFuc2l0aW9uR3JvdXAnKTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ1NTVHJhbnNpdGlvbkdyb3VwKTtcblxudmFyIF9mb3Jtc3lSZWFjdCA9IHJlcXVpcmUoJ2Zvcm1zeS1yZWFjdCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR0lucHV0ID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShHSW5wdXQsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gR0lucHV0KHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIEdJbnB1dCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoR0lucHV0Ll9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHSW5wdXQpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBibHVycmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5jaGFuZ2VWYWx1ZSA9IF90aGlzLmNoYW5nZVZhbHVlLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kZWxCbHVyID0gX3RoaXMuaGFuZGVsQmx1ci5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuZW5hYmxlU3VibWl0QnV0dG9uID0gX3RoaXMuY2hhbmdlVmFsdWUuYmluZChfdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEdJbnB1dCwgW3tcbiAgICAgICAga2V5OiAnY2hhbmdlVmFsdWUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2hhbmdlVmFsdWUoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0VmFsdWUoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRlbEJsdXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGVsQmx1cigpIHtcbiAgICAgICAgICAgIGlmICghIXRoaXMucHJvcHMuZ2V0VmFsdWUoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBibHVycmVkOiB0cnVlIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYmx1cnJlZDogZmFsc2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy5zaG93UmVxdWlyZWQoKSA/ICdnLWlucHV0LXJlcXVpcmVkJyA6IHRoaXMucHJvcHMuc2hvd0Vycm9yKCkgPyAnZy1pbnB1dC1lcnJvcicgOiBudWxsO1xuXG4gICAgICAgICAgICAvLyBBbiBlcnJvciBtZXNzYWdlIGlzIHJldHVybmVkIE9OTFkgaWYgdGhlIGNvbXBvbmVudCBpcyBpbnZhbGlkXG4gICAgICAgICAgICAvLyBvciB0aGUgc2VydmVyIGhhcyByZXR1cm5lZCBhbiBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gW107XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5ibHVycmVkICYmIHRoaXMucHJvcHMuZ2V0RXJyb3JNZXNzYWdlKCkpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSB0aGlzLnByb3BzLmdldEVycm9yTWVzc2FnZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IFwiZy1jb250YWluZXItY29sIGctaW5wdXQgXCIgKyAoY2xhc3NOYW1lIHx8IFwiXCIpIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAgICAgICAgIHsgaHRtbEZvcjogdGhpcy5wcm9wcy5uYW1lIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgX0NTU1RyYW5zaXRpb25Hcm91cDIuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHJhbnNpdGlvbk5hbWU6ICdnLWlucHV0LWVycm9yLW1lc3NhZ2UtYW5pbWF0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ6IDUwMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlICE9IFwiXCIgPyBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc3BhbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdnLWlucHV0LWVycm9yLW1lc3NhZ2UnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnaW5wdXQnLCB7IHR5cGU6IHRoaXMucHJvcHMudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5wcm9wcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5jaGFuZ2VWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgb25CbHVyOiB0aGlzLmhhbmRlbEJsdXIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmdldFZhbHVlKCkgfHwgJydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gR0lucHV0O1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9mb3Jtc3lSZWFjdC5IT0MpKEdJbnB1dCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEdTdWJtaXQgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEdTdWJtaXQsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gR1N1Ym1pdChwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBHU3VibWl0KTtcblxuICAgICAgICB2YXIgX3RoaXMgPSAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChHU3VibWl0Ll9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHU3VibWl0KSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgZGlzYWJsZWQ6IF90aGlzLnByb3BzLmRpc2FibGVkLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBfdGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgXCJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShHU3VibWl0LCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgICAgICBpZiAoISFuZXh0UHJvcHMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGlzYWJsZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkaXNhYmxlZDogZmFsc2UgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghIW5leHRQcm9wcy5jbGFzc05hbWUgJiYgbmV4dFByb3BzLmNsYXNzTmFtZSAhPSB0aGlzLnN0YXRlLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjbGFzc05hbWU6IG5leHRQcm9wcy5jbGFzc05hbWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge31cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2J1dHRvbicsXG4gICAgICAgICAgICAgICAgeyB0eXBlOiAnc3VibWl0JywgY2xhc3NOYW1lOiBcImJ0blwiICsgKHRoaXMuc3RhdGUuZGlzYWJsZWQgPyBcIiBidG4tZGlzYWJsZWRcIiA6IFwiXCIpICsgKFwiIFwiICsgdGhpcy5zdGF0ZS5jbGFzc05hbWUgfHwgXCJcIiksIGRpc2FibGVkOiB0aGlzLnN0YXRlLmRpc2FibGVkIH0sXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gR1N1Ym1pdDtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlVG9Qcm9wcyhzdGF0ZSkge1xuICAgIHJldHVybiB7fTtcbn1cblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9yZWFjdFJlZHV4LmNvbm5lY3QpKG1hcFN0YXRlVG9Qcm9wcywge30pKEdTdWJtaXQpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwID0gcmVxdWlyZSgncmVhY3QtdHJhbnNpdGlvbi1ncm91cC9DU1NUcmFuc2l0aW9uR3JvdXAnKTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ1NTVHJhbnNpdGlvbkdyb3VwKTtcblxudmFyIF9mb3Jtc3lSZWFjdCA9IHJlcXVpcmUoJ2Zvcm1zeS1yZWFjdCcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR1RleHRBcmVhID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShHVGV4dEFyZWEsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gR1RleHRBcmVhKHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIEdUZXh0QXJlYSk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoR1RleHRBcmVhLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHVGV4dEFyZWEpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBibHVycmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5jaGFuZ2VWYWx1ZSA9IF90aGlzLmNoYW5nZVZhbHVlLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kZWxCbHVyID0gX3RoaXMuaGFuZGVsQmx1ci5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuZW5hYmxlU3VibWl0QnV0dG9uID0gX3RoaXMuY2hhbmdlVmFsdWUuYmluZChfdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEdUZXh0QXJlYSwgW3tcbiAgICAgICAga2V5OiAnY2hhbmdlVmFsdWUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY2hhbmdlVmFsdWUoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuc2V0VmFsdWUoZXZlbnQuY3VycmVudFRhcmdldC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRlbEJsdXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGVsQmx1cigpIHtcbiAgICAgICAgICAgIGlmICghIXRoaXMucHJvcHMuZ2V0VmFsdWUoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBibHVycmVkOiB0cnVlIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYmx1cnJlZDogZmFsc2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gdGhpcy5wcm9wcy5zaG93UmVxdWlyZWQoKSA/ICdnLXRleHQtYXJlYS1yZXF1aXJlZCcgOiB0aGlzLnByb3BzLnNob3dFcnJvcigpID8gJ2ctdGV4dC1hcmVhLWVycm9yJyA6IG51bGw7XG5cbiAgICAgICAgICAgIC8vIEFuIGVycm9yIG1lc3NhZ2UgaXMgcmV0dXJuZWQgT05MWSBpZiB0aGUgY29tcG9uZW50IGlzIGludmFsaWRcbiAgICAgICAgICAgIC8vIG9yIHRoZSBzZXJ2ZXIgaGFzIHJldHVybmVkIGFuIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmJsdXJyZWQgJiYgdGhpcy5wcm9wcy5nZXRFcnJvck1lc3NhZ2UoKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IHRoaXMucHJvcHMuZ2V0RXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogXCJnLWNvbnRhaW5lci1jb2wgZy10ZXh0LWFyZWEgXCIgKyAoY2xhc3NOYW1lIHx8IFwiXCIpIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAgICAgICAgIHsgaHRtbEZvcjogdGhpcy5wcm9wcy5uYW1lIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgX0NTU1RyYW5zaXRpb25Hcm91cDIuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdHJhbnNpdGlvbk5hbWU6ICdnLXRleHQtYXJlYS1lcnJvci1tZXNzYWdlLWFuaW1hdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0OiA1MDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSAhPSBcIlwiID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy10ZXh0LWFyZWEtZXJyb3ItbWVzc2FnZScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICkgOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScsIHsgdHlwZTogdGhpcy5wcm9wcy50eXBlLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLnByb3BzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLmNoYW5nZVZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBvbkJsdXI6IHRoaXMuaGFuZGVsQmx1cixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucHJvcHMuZ2V0VmFsdWUoKSB8fCAnJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBHVGV4dEFyZWE7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX2Zvcm1zeVJlYWN0LkhPQykoR1RleHRBcmVhKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5ydW4gPSBydW47XG5leHBvcnRzLmdldFN0b3JlID0gZ2V0U3RvcmU7XG5leHBvcnRzLmluamVjdE1vZHVsZSA9IGluamVjdE1vZHVsZTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0RG9tID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG5cbnZhciBfc2FnYXMgPSByZXF1aXJlKCcuL3NhZ2FzL3NhZ2FzJyk7XG5cbnZhciBfcm91dGVzID0gcmVxdWlyZSgnLi9yb3V0ZXIvcm91dGVzJyk7XG5cbnZhciBfcmVkdWNlcnMgPSByZXF1aXJlKCcuL3JlZHVjZXJzL3JlZHVjZXJzJyk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxudmFyIF9yZWFjdFJlZHV4ID0gcmVxdWlyZSgncmVhY3QtcmVkdXgnKTtcblxudmFyIF9yZWFjdFJvdXRlclJlZHV4ID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyLXJlZHV4Jyk7XG5cbnZhciBfY29uZmlndXJlU3RvcmUgPSByZXF1aXJlKCcuL3N0b3JlL2NvbmZpZ3VyZVN0b3JlJyk7XG5cbnZhciBfY29uZmlndXJlU3RvcmUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY29uZmlndXJlU3RvcmUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgc3RvcmUgPSBudWxsO1xudmFyIGhpc3RvcnkgPSBudWxsO1xudmFyIHJvdXRlcyA9IG51bGw7XG5cbi8vIHJlZ3VsYXIgcmVuZGVyXG5mdW5jdGlvbiBydW4oKSB7XG4gICAgLy8gaW5pdCBzdG9yZSwgc2FnYXMsIGhpc3RvcnksIGFuZCByb3V0ZXNcbiAgICBzdG9yZSA9ICgwLCBfY29uZmlndXJlU3RvcmUyLmRlZmF1bHQpKHdpbmRvdy5fX0lOSVRJQUxfU1RBVEVfXywgKDAsIF9yZWR1Y2Vycy5yb290UmVkdWNlcikoKSk7XG4gICAgc3RvcmUucnVuU2FnYSgoMCwgX3NhZ2FzLnJvb3RTYWdhKSgpLCBzdG9yZS5kaXNwYXRjaCk7XG4gICAgaGlzdG9yeSA9ICgwLCBfcmVhY3RSb3V0ZXJSZWR1eC5zeW5jSGlzdG9yeVdpdGhTdG9yZSkoX3JlYWN0Um91dGVyLmJyb3dzZXJIaXN0b3J5LCBzdG9yZSk7XG4gICAgcm91dGVzID0gKDAsIF9yb3V0ZXMucmVnaXN0ZXJlZFJvdXRlcykoKTtcblxuICAgIC8vIHJlbmRlciBvdXQgZG9jXG4gICAgKDAsIF9yZWFjdERvbS5yZW5kZXIpKF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBfcmVhY3RSZWR1eC5Qcm92aWRlcixcbiAgICAgICAgeyBzdG9yZTogc3RvcmUgfSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX3JlYWN0Um91dGVyLlJvdXRlciwgeyBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgICAgIH0sIGhpc3Rvcnk6IGhpc3RvcnksIHJvdXRlczogcm91dGVzIH0pXG4gICAgKSwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKTtcbn1cblxuZnVuY3Rpb24gZ2V0U3RvcmUoKSB7XG4gICAgcmV0dXJuIHN0b3JlO1xufVxuXG5mdW5jdGlvbiBpbmplY3RNb2R1bGUoYSkge1xuICAgICgwLCBfc2FnYXMuaW5qZWN0U2FnYXMpKGEuc2FnYXMpO1xuICAgICgwLCBfcm91dGVzLmluamVjdFJvdXRlcykoYS5yb3V0ZXMpO1xuICAgICgwLCBfcmVkdWNlcnMuaW5qZWN0UmVkdWNlcnMpKGEucmVkdWNlcnMpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2RlZmluZVByb3BlcnR5Jyk7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmaW5lUHJvcGVydHkyKTtcblxudmFyIF9leHRlbmRzNSA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9leHRlbmRzJyk7XG5cbnZhciBfZXh0ZW5kczYgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9leHRlbmRzNSk7XG5cbnZhciBfcmVkdXggPSByZXF1aXJlKCdyZWR1eCcpO1xuXG52YXIgX2FwaVJlcXVlc3RBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9hcGlSZXF1ZXN0QWN0aW9ucycpO1xuXG52YXIgYWN0aW9ucyA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9hcGlSZXF1ZXN0QWN0aW9ucyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGFwaVJlcXVlc3RSZWR1Y2VyKCkge1xuICAgIHZhciBzdGF0ZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgdmFyIGFjdGlvbiA9IGFyZ3VtZW50c1sxXTtcblxuICAgIHZhciBrZXkgPSBhY3Rpb24ua2V5O1xuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSBhY3Rpb25zLlJFUVVFU1Q6XG4gICAgICAgICAgICByZXR1cm4gKDAsIF9leHRlbmRzNi5kZWZhdWx0KSh7fSwgc3RhdGUsICgwLCBfZGVmaW5lUHJvcGVydHkzLmRlZmF1bHQpKHt9LCBrZXksICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4gICAgICAgICAgICAgICAgaXNGZXRjaGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICByZXF1ZXN0ZWRBdDogYWN0aW9uLnJlcXVlc3RlZEF0XG4gICAgICAgICAgICB9KSkpO1xuICAgICAgICBjYXNlIGFjdGlvbnMuU1VDQ0VTUzpcbiAgICAgICAgICAgIHJldHVybiAoMCwgX2V4dGVuZHM2LmRlZmF1bHQpKHt9LCBzdGF0ZSwgKDAsIF9kZWZpbmVQcm9wZXJ0eTMuZGVmYXVsdCkoe30sIGtleSwgKDAsIF9leHRlbmRzNi5kZWZhdWx0KSh7fSwgc3RhdGVba2V5XSwge1xuICAgICAgICAgICAgICAgIGtleTogYWN0aW9uLmtleSxcbiAgICAgICAgICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZWNlaXZlZEF0OiBhY3Rpb24ucmVjZWl2ZWRBdCxcbiAgICAgICAgICAgICAgICBkYXRhOiBhY3Rpb24uZGF0YVxuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgY2FzZSBhY3Rpb25zLkZBSUxVUkU6XG4gICAgICAgICAgICByZXR1cm4gKDAsIF9leHRlbmRzNi5kZWZhdWx0KSh7fSwgc3RhdGUsICgwLCBfZGVmaW5lUHJvcGVydHkzLmRlZmF1bHQpKHt9LCBrZXksICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4gICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWRBdDogYWN0aW9uLnJlY2VpdmVkQXQsXG4gICAgICAgICAgICAgICAgZXJyOiBhY3Rpb24uZXJyXG4gICAgICAgICAgICB9KSkpO1xuICAgICAgICBjYXNlIGFjdGlvbnMuUFVSR0U6XG4gICAgICAgICAgICB2YXIgcyA9ICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlKTtcbiAgICAgICAgICAgIGRlbGV0ZSBzW2tleV07XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG5cbnZhciBhcGlSZXF1ZXN0UmVkdWNlcnMgPSAoMCwgX3JlZHV4LmNvbWJpbmVSZWR1Y2Vycykoe1xuICAgIHJlcXVlc3Q6IGFwaVJlcXVlc3RSZWR1Y2VyXG59KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gYXBpUmVxdWVzdFJlZHVjZXJzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvZXh0ZW5kcycpO1xuXG52YXIgX2V4dGVuZHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXh0ZW5kczIpO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvYXNzaWduJyk7XG5cbnZhciBfYXNzaWduMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2Fzc2lnbik7XG5cbmV4cG9ydHMuaW5qZWN0UmVkdWNlcnMgPSBpbmplY3RSZWR1Y2VycztcbmV4cG9ydHMucm9vdFJlZHVjZXIgPSByb290UmVkdWNlcjtcblxudmFyIF9yZWFjdFJvdXRlclJlZHV4ID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyLXJlZHV4Jyk7XG5cbnZhciBfcmVkdXggPSByZXF1aXJlKCdyZWR1eCcpO1xuXG52YXIgX2FwaVJlcXVlc3RSZWR1Y2VycyA9IHJlcXVpcmUoJy4vYXBpUmVxdWVzdFJlZHVjZXJzJyk7XG5cbnZhciBfYXBpUmVxdWVzdFJlZHVjZXJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FwaVJlcXVlc3RSZWR1Y2Vycyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBpbmplY3RlZFJlZHVjZXJzID0ge307XG5cbmZ1bmN0aW9uIGluamVjdFJlZHVjZXJzKHIpIHtcbiAgICBpbmplY3RlZFJlZHVjZXJzID0gKDAsIF9hc3NpZ24yLmRlZmF1bHQpKHt9LCByLCBpbmplY3RlZFJlZHVjZXJzKTtcbn1cblxuZnVuY3Rpb24gcm9vdFJlZHVjZXIoKSB7XG4gICAgcmV0dXJuICgwLCBfcmVkdXguY29tYmluZVJlZHVjZXJzKSgoMCwgX2V4dGVuZHMzLmRlZmF1bHQpKHtcbiAgICAgICAgYXBpOiBfYXBpUmVxdWVzdFJlZHVjZXJzMi5kZWZhdWx0XG4gICAgfSwgaW5qZWN0ZWRSZWR1Y2Vycywge1xuICAgICAgICByb3V0aW5nOiBfcmVhY3RSb3V0ZXJSZWR1eC5yb3V0ZXJSZWR1Y2VyXG4gICAgfSkpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmluamVjdFJvdXRlcyA9IGluamVjdFJvdXRlcztcbmV4cG9ydHMucmVnaXN0ZXJlZFJvdXRlcyA9IHJlZ2lzdGVyZWRSb3V0ZXM7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdFJvdXRlciA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpO1xuXG52YXIgX2Jhc2VfdG1wbCA9IHJlcXVpcmUoJy4uL2Jhc2VfdG1wbCcpO1xuXG52YXIgX2Jhc2VfdG1wbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9iYXNlX3RtcGwpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaW5qZWN0ZWRSb3V0ZXMgPSBbXTtcbnZhciByb3V0ZXMgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICBfcmVhY3RSb3V0ZXIuUm91dGUsXG4gICAgeyBjb21wb25lbnQ6IF9iYXNlX3RtcGwyLmRlZmF1bHQgfSxcbiAgICBpbmplY3RlZFJvdXRlc1xuKTtcblxuZnVuY3Rpb24gaW5qZWN0Um91dGVzKHIpIHtcbiAgICBpbmplY3RlZFJvdXRlcy5wdXNoKHIpO1xufVxuXG5mdW5jdGlvbiByZWdpc3RlcmVkUm91dGVzKCkge1xuICAgIHJldHVybiByb3V0ZXM7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9yZWdlbmVyYXRvciA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3InKTtcblxudmFyIF9yZWdlbmVyYXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWdlbmVyYXRvcik7XG5cbmV4cG9ydHMucm9vdFNhZ2EgPSByb290U2FnYTtcbmV4cG9ydHMuaW5qZWN0U2FnYXMgPSBpbmplY3RTYWdhcztcblxudmFyIF9lZmZlY3RzID0gcmVxdWlyZSgncmVkdXgtc2FnYS9lZmZlY3RzJyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBpbmplY3RlZFNhZ2FzID0gW107XG52YXIgc2FnYXMgPSBbXTtcblxuZnVuY3Rpb24gcm9vdFNhZ2EoKSB7XG4gICAgcmV0dXJuIF9yZWdlbmVyYXRvcjIuZGVmYXVsdC5tYXJrKGZ1bmN0aW9uIF9jYWxsZWUoKSB7XG4gICAgICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQud3JhcChmdW5jdGlvbiBfY2FsbGVlJChfY29udGV4dCkge1xuICAgICAgICAgICAgd2hpbGUgKDEpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9jb250ZXh0LnByZXYgPSBfY29udGV4dC5uZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jb250ZXh0Lm5leHQgPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdLmNvbmNhdChpbmplY3RlZFNhZ2FzKTtcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2NvbnRleHQuc3RvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgX2NhbGxlZSwgdGhpcyk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGluamVjdFNhZ2FzKHMpIHtcbiAgICBpbmplY3RlZFNhZ2FzLnB1c2goKDAsIF9lZmZlY3RzLmZvcmspKHMpKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5FTkRQT0lOVFMgPSBleHBvcnRzLlVTRVJfREFUQV9TVE9SQUdFX0tFWSA9IGV4cG9ydHMuREVWSUNFX1RPS0VOX0hFQURFUiA9IGV4cG9ydHMuQVVUSF9UT0tFTl9IRUFERVIgPSB1bmRlZmluZWQ7XG5cbnZhciBfc3RyaW5naWZ5ID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5Jyk7XG5cbnZhciBfc3RyaW5naWZ5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ2lmeSk7XG5cbnZhciBfcHJvbWlzZSA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlJyk7XG5cbnZhciBfcHJvbWlzZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9taXNlKTtcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2Fzc2lnbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hc3NpZ24pO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxuZXhwb3J0cy5HZXQgPSBHZXQ7XG5leHBvcnRzLlBvc3QgPSBQb3N0O1xuZXhwb3J0cy5QdXQgPSBQdXQ7XG5leHBvcnRzLkRlbGV0ZSA9IERlbGV0ZTtcblxudmFyIF9pc29tb3JwaGljRmV0Y2ggPSByZXF1aXJlKCdpc29tb3JwaGljLWZldGNoJyk7XG5cbnZhciBfaXNvbW9ycGhpY0ZldGNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2lzb21vcnBoaWNGZXRjaCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBBVVRIX1RPS0VOX0hFQURFUiA9IGV4cG9ydHMuQVVUSF9UT0tFTl9IRUFERVIgPSAnWC1BdXRoLVRva2VuJztcbnZhciBERVZJQ0VfVE9LRU5fSEVBREVSID0gZXhwb3J0cy5ERVZJQ0VfVE9LRU5fSEVBREVSID0gJ1gtRGV2aWNlLVRva2VuJztcbnZhciBVU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSBleHBvcnRzLlVTRVJfREFUQV9TVE9SQUdFX0tFWSA9ICdVU0VSX0RBVEFfU1RPUkFHRV9LRVknO1xudmFyIEVORFBPSU5UUyA9IGV4cG9ydHMuRU5EUE9JTlRTID0ge1xuICAgIGxvZ2luOiBcIi9hcGkvbG9naW5cIlxufTtcblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgIH0sXG4gICAgbW9kZTogJ2NvcnMnLFxuICAgIGNhY2hlOiAnZGVmYXVsdCcsXG4gICAgbWV0aG9kOiAnR0VUJyxcbiAgICBib2R5OiBudWxsXG59O1xuXG52YXIgQXBpID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFwaSh1cmwpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBBcGkpO1xuXG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSAoMCwgX2Fzc2lnbjIuZGVmYXVsdCkoZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIGFkZCBhdXRoIGhlYWRlcnMgaWYgdGhleSBhcmUgcHJlc2VudFxuICAgICAgICBpZiAoISFzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKEFVVEhfVE9LRU5fSEVBREVSKSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlcnNbQVVUSF9UT0tFTl9IRUFERVJdID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShBVVRIX1RPS0VOX0hFQURFUik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShERVZJQ0VfVE9LRU5fSEVBREVSKSkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmhlYWRlcnNbREVWSUNFX1RPS0VOX0hFQURFUl0gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKERFVklDRV9UT0tFTl9IRUFERVIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mZXRjaCA9IF9pc29tb3JwaGljRmV0Y2gyLmRlZmF1bHQ7XG4gICAgfVxuXG4gICAgKDAsIF9jcmVhdGVDbGFzczMuZGVmYXVsdCkoQXBpLCBbe1xuICAgICAgICBrZXk6ICdjYWxsQXBpJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhbGxBcGkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh0aGlzLnVybCwgdGhpcy5vcHRpb25zKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImhcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCkudGhlbihmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgICAgICAvLyBzdWNjZXNzXG4gICAgICAgICAgICAgICAgICAgIC8vIHRvZG8gbmVlZCB0byByZWFyYW5nZSB0aGlzIHNvIHRoYXQgMjAwIHdpdGhvdXQganNvbiBjb21lcyBiYWNrIHN1Y2Nlc3NmdWxcbiAgICAgICAgICAgICAgICAgICAgLy8gdG9kbyB0aGVuIHdlIG5lZWQgdG8gYWRkIGEgc3VjY2VzcyBoYW5kbGVyIHRvIHRoZSBjb250YWN0IGZvcm0gc28gdGhhdCBwZW9wbGUgb25seSBzdWJtaXQgb25jZVxuICAgICAgICAgICAgICAgICAgICAvLyB0b2RvIHRoZW4gd2UgbmVlZCB0byB1cGRhdGUgdGhlIGZvcm1zIHRvIGFsbG93IGZvciBzdWJpdCBhbmQgZXJyb3IgYXMgYXBwb3NlZCB0byBqdXN0IGEgZGlzYWJsZWQgYnRuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzID09IDIwMCB8fCByZXMuc3RhdHVzID09IDIwNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIyMDBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSByZWNlaXZlIGFuIGF1dGggdG9rZW4gd2Ugc2hvdWxkIGFkZCB0aGlzIHRvIHRoZSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmhlYWRlcnMuaGFzKEFVVEhfVE9LRU5fSEVBREVSKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oQVVUSF9UT0tFTl9IRUFERVIsIHJlcy5oZWFkZXJzLmdldChBVVRIX1RPS0VOX0hFQURFUikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgcmVjZWl2ZSBhIGRldmljZSB0b2tlbiB3ZSBzaG91bGQgYWRkIHRoaXMgdG8gdGhlIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMuaGVhZGVycy5oYXMoREVWSUNFX1RPS0VOX0hFQURFUikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKERFVklDRV9UT0tFTl9IRUFERVIsIHJlcy5oZWFkZXJzLmdldChERVZJQ0VfVE9LRU5fSEVBREVSKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHJlcy5zdGF0dXMsIGpzb246IGpzb24gfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgYXV0aG9yaXphdGlvbiBlcnJvciB3ZSBzaG91bGQgZGVsZXRlIHRoZSBhdXRoIHRva2VuXG5cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc3N1ZXNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyZXMuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oQVVUSF9UT0tFTl9IRUFERVIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9wcm9taXNlMi5kZWZhdWx0LnJlamVjdCh7IHN0YXR1czogcmVzLnN0YXR1cywganNvbjoganNvbiB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcHJvbWlzZTIuZGVmYXVsdC5yZWplY3QoeyBzdGF0dXM6IHJlcy5zdGF0dXMsIGpzb246IGpzb24gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyByZXM6IHJlcyB9O1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIC8vZmFpbFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IGVyciB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEFwaTtcbn0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gQXBpO1xuZnVuY3Rpb24gR2V0KHVybCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIG9wdGlvbnMubWV0aG9kID0gXCJHRVRcIjtcbiAgICByZXR1cm4gbmV3IEFwaSh1cmwsIG9wdGlvbnMpLmNhbGxBcGkoKTtcbn1cblxuZnVuY3Rpb24gUG9zdCh1cmwsIGJvZHkpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgICBvcHRpb25zLm1ldGhvZCA9IFwiUE9TVFwiO1xuXG4gICAgLy8gc3RyaW5naWZ5IGJvZHkgaWYgbmVlZGVkXG4gICAgaWYgKCEhYm9keSkge1xuICAgICAgICBvcHRpb25zLmJvZHkgPSAoMCwgX3N0cmluZ2lmeTIuZGVmYXVsdCkoYm9keSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQXBpKHVybCwgb3B0aW9ucykuY2FsbEFwaSgpO1xufVxuXG5mdW5jdGlvbiBQdXQodXJsLCBib2R5KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgb3B0aW9ucy5tZXRob2QgPSBcIlBVVFwiO1xuXG4gICAgLy8gc3RyaW5naWZ5IGJvZHkgaWYgbmVlZGVkXG4gICAgaWYgKCEhYm9keSkge1xuICAgICAgICBvcHRpb25zLmJvZHkgPSAoMCwgX3N0cmluZ2lmeTIuZGVmYXVsdCkoYm9keSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQXBpKHVybCwgb3B0aW9ucykuY2FsbEFwaSgpO1xufVxuXG5mdW5jdGlvbiBEZWxldGUodXJsKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgb3B0aW9ucy5tZXRob2QgPSBcIkRlbGV0ZVwiO1xuICAgIHJldHVybiBuZXcgQXBpKHVybCwgb3B0aW9ucykuY2FsbEFwaSgpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRlZmF1bHQgPSBjb25maWd1cmVTdG9yZTtcblxudmFyIF9yZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XG5cbnZhciBfcmVkdXhMb2dnZXIgPSByZXF1aXJlKCdyZWR1eC1sb2dnZXInKTtcblxudmFyIF9yZWR1eFNhZ2EgPSByZXF1aXJlKCdyZWR1eC1zYWdhJyk7XG5cbnZhciBfcmVkdXhTYWdhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlZHV4U2FnYSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGNvbmZpZ3VyZVN0b3JlKGluaXRpYWxTdGF0ZSwgcm9vdFJlZHVjZXIpIHtcblxuICAgIHZhciBzYWdhTWlkZGxld2FyZSA9ICgwLCBfcmVkdXhTYWdhMi5kZWZhdWx0KSgpO1xuICAgIHZhciBsb2dnZXIgPSAoMCwgX3JlZHV4TG9nZ2VyLmNyZWF0ZUxvZ2dlcikoe1xuICAgICAgICBjb2xsYXBzZWQ6IHRydWVcbiAgICB9KTtcblxuICAgIHZhciBjb21wb3NlRW5oYW5jZXJzID0gd2luZG93Ll9fUkVEVVhfREVWVE9PTFNfRVhURU5TSU9OX0NPTVBPU0VfXyB8fCBfcmVkdXguY29tcG9zZTtcbiAgICB2YXIgc3RvcmUgPSAoMCwgX3JlZHV4LmNyZWF0ZVN0b3JlKShyb290UmVkdWNlciwgaW5pdGlhbFN0YXRlLCBjb21wb3NlRW5oYW5jZXJzKCgwLCBfcmVkdXguYXBwbHlNaWRkbGV3YXJlKShzYWdhTWlkZGxld2FyZSwgbG9nZ2VyKSkpO1xuXG4gICAgc3RvcmUucnVuU2FnYSA9IHNhZ2FNaWRkbGV3YXJlLnJ1bjtcbiAgICBzdG9yZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JlLmRpc3BhdGNoKF9yZWR1eFNhZ2EuRU5EKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0b3JlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJ1biA9IHJ1bjtcbmZ1bmN0aW9uIHJ1bih3aXRoQWRtaW4sIGFjdGl2ZVBsdWdpbnMsIGFjdGl2ZVRoZW1lKSB7XG5cbiAgICAvLyBmaXJzdCBnZXQgZ29DTVMgYmFzZVxuICAgIHZhciBnb0NNU0Jhc2UgPSByZXF1aXJlKCcuL2Jhc2UvaW5pdC5qcycpO1xuXG4gICAgaWYgKCEhd2luZG93Lk1TSW5wdXRNZXRob2RDb250ZXh0ICYmICEhZG9jdW1lbnQuZG9jdW1lbnRNb2RlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSUUxMTogTG9hZGluZyBwcm9taXNlIHBvbHlmaWxsXCIpO1xuICAgICAgICByZXF1aXJlKCdlczYtcHJvbWlzZScpLnBvbHlmaWxsKCk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgdG8gc2VlIGlmIHdlIGFyZSBsb2FkaW5nIGFkbWluIHNlY3Rpb25cbiAgICBpZiAoISF3aXRoQWRtaW4pIHtcbiAgICAgICAgdmFyIGdvQ01TQWRtaW4gPSByZXF1aXJlKCcuL2FkbWluL2luaXQuanMnKS5kZWZhdWx0O1xuICAgICAgICBnb0NNU0Jhc2UuaW5qZWN0TW9kdWxlKGdvQ01TQWRtaW4pO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWN0aXZlUGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYWN0aXZlUGx1Z2luSW5pdCA9IGFjdGl2ZVBsdWdpbnNbaV0gKyBcIi9pbml0aWFsaXplLmpzXCI7XG4gICAgICAgIHZhciBhY3RpdmVQbHVnaW4gPSByZXF1aXJlKGFjdGl2ZVBsdWdpbkluaXQpLmRlZmF1bHQ7XG4gICAgICAgIGdvQ01TQmFzZS5pbmplY3RNb2R1bGUoYWN0aXZlUGx1Z2luKTtcbiAgICB9XG5cbiAgICAvLyBsb2FkIHRoZSB0aGVtZVxuICAgIHZhciB0aGVtZUluaXQgPSBhY3RpdmVUaGVtZSArICcvdGhlbWUvaW5pdGlhbGl6ZS5qcyc7XG4gICAgdmFyIGdvQ01TVGhlbWUgPSByZXF1aXJlKHRoZW1lSW5pdCkuZGVmYXVsdDtcbiAgICBnb0NNU0Jhc2UuaW5qZWN0TW9kdWxlKGdvQ01TVGhlbWUpO1xuXG4gICAgLy8gcnVuIHRoZSBjbXNcbiAgICBnb0NNU0Jhc2UucnVuKCk7XG59XG4iXX0=