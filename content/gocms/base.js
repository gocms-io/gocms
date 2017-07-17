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

require.register("gocms/base/components/busy/Busy.js", function(exports, require, module) {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GError = function (_React$Component) {
    (0, _inherits3.default)(GError, _React$Component);

    function GError(props) {
        (0, _classCallCheck3.default)(this, GError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GError.__proto__ || (0, _getPrototypeOf2.default)(GError)).call(this, props));

        _this.state = {
            errMessage: _this.props.errMessage || null,
            size: _this.props.size || "20px",
            color: _this.props.color || "#006797",
            margin: _this.props.margin || "0 2%"
        };

        _this.style = {
            width: _this.state.size,
            height: _this.state.size,
            backgroundColor: _this.state.color,
            margin: _this.state.margin
        };
        return _this;
    }

    (0, _createClass3.default)(GError, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.errMessage) {
                this.setState({ errMessage: nextProps.errMessage });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'busy-loader-wrapper' },
                _react2.default.createElement('div', { className: 'busy-loader busy-loader-1', style: this.style }),
                _react2.default.createElement('div', { className: 'busy-loader busy-loader-2', style: this.style }),
                _react2.default.createElement('div', { className: 'busy-loader busy-loader-3', style: this.style })
            );
        }
    }]);
    return GError;
}(_react2.default.Component);

exports.default = GError;

});

require.register("gocms/base/components/gForm/GError.js", function(exports, require, module) {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GError = function (_React$Component) {
    (0, _inherits3.default)(GError, _React$Component);

    function GError(props) {
        (0, _classCallCheck3.default)(this, GError);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GError.__proto__ || (0, _getPrototypeOf2.default)(GError)).call(this, props));

        _this.state = {
            errMessage: _this.props.errMessage || null
        };
        return _this;
    }

    (0, _createClass3.default)(GError, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.errMessage) {
                this.setState({ errMessage: nextProps.errMessage });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: "g-error-message " + (this.props.className || "") },
                _react2.default.createElement(
                    _CSSTransitionGroup2.default,
                    { transitionName: 'g-error-message-box-animate',
                        transitionEnterTimeout: 500,
                        transitionLeaveTimeout: 500 },
                    !!this.state.errMessage ? _react2.default.createElement(
                        'h3',
                        null,
                        this.state.errMessage
                    ) : null
                )
            );
        }
    }]);
    return GError;
}(_react2.default.Component);

exports.default = GError;

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

var _GInput = require('./GInput');

var _GInput2 = _interopRequireDefault(_GInput);

var _GTextArea = require('./GTextArea');

var _GTextArea2 = _interopRequireDefault(_GTextArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GForm = function (_React$Component) {
    (0, _inherits3.default)(GForm, _React$Component);

    function GForm(props) {
        (0, _classCallCheck3.default)(this, GForm);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GForm.__proto__ || (0, _getPrototypeOf2.default)(GForm)).call(this, props));

        _this.state = {
            submitButtonIsDisabled: true,
            submitBtnClassName: _this.props.submitBtnClassName || "",
            submitBtnShake: _this.props.submitBtnShake,
            submitBtnBusy: false,
            dirty: false
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

            // busy button
            if (nextProps.submitBtnBusy) {
                this.setState({
                    submitBtnBusy: true
                });
            } else {
                this.setState({
                    submitBtnBusy: false
                });
            }

            // shake button
            if (nextProps.submitBtnShake) {
                this.setState({
                    submitBtnShake: true
                });
            } else {
                this.setState({
                    submitBtnShake: false
                });
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
                // if button is "disabled" then don't allow form to submit. Instead show error.
                if (this.state.submitButtonIsDisabled) {

                    this.setState({
                        submitBtnShake: true,
                        dirty: true
                    });
                    // rest button shake after 1 second
                    setTimeout(function () {
                        this.setState({ submitBtnShake: false });
                    }.bind(this), 1000);
                }
                // otherwise submit
                else {
                        this.props.onSubmit(model);
                        this.setState({ submitBtnBusy: true });
                    }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var isDirty = this.state.dirty;
            var childrenWithProps = _react2.default.Children.map(this.props.children, function (child) {
                if (!!child) {
                    // if gocms form type
                    if (child.type == _GInput2.default || child.type == _GTextArea2.default) {
                        return _react2.default.cloneElement(child, {
                            dirty: isDirty,
                            key: child.props.key
                        });
                    }
                    // else pass through
                    else {
                            return _react2.default.cloneElement(child, {
                                key: child.props.key
                            });
                        }
                }
            });

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
                childrenWithProps,
                !this.props.submitBtn ? "" : _react2.default.createElement(
                    _GSubmit2.default,
                    { type: 'submit', className: this.state.submitBtnClassName,
                        shake: this.state.submitBtnShake,
                        busy: this.state.submitBtnBusy
                    },
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

require.register("gocms/base/components/gForm/GHidden.js", function(exports, require, module) {
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

var GHidden = function (_React$Component) {
    (0, _inherits3.default)(GHidden, _React$Component);

    function GHidden(props) {
        (0, _classCallCheck3.default)(this, GHidden);
        return (0, _possibleConstructorReturn3.default)(this, (GHidden.__proto__ || (0, _getPrototypeOf2.default)(GHidden)).call(this, props));
    }

    (0, _createClass3.default)(GHidden, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement('input', { type: 'hidden',
                name: this.props.name,
                value: this.props.getValue() || ''
            });
        }
    }]);
    return GHidden;
}(_react2.default.Component);

exports.default = (0, _formsyReact.HOC)(GHidden);

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
            blurred: false,
            dirty: false
        };
        _this.changeValue = _this.changeValue.bind(_this);
        _this.handelBlur = _this.handelBlur.bind(_this);
        _this.enableSubmitButton = _this.changeValue.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(GInput, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!!nextProps.dirty) {
                this.setState({ dirty: true });
            }
        }
    }, {
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
            } else if (this.state.dirty && this.props.showRequired()) {
                errorMessage = "*Required";
            }

            return _react2.default.createElement(
                'div',
                { className: "g-container-col g-input " + (this.props.className || "") },
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

var _Busy = require('../busy/Busy');

var _Busy2 = _interopRequireDefault(_Busy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GSubmit = function (_React$Component) {
    (0, _inherits3.default)(GSubmit, _React$Component);

    function GSubmit(props) {
        (0, _classCallCheck3.default)(this, GSubmit);

        var _this = (0, _possibleConstructorReturn3.default)(this, (GSubmit.__proto__ || (0, _getPrototypeOf2.default)(GSubmit)).call(this, props));

        _this.state = {
            shake: false,
            disabled: _this.props.disabled,
            className: _this.props.className || "",
            busy: false
        };

        return _this;
    }

    (0, _createClass3.default)(GSubmit, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // disabled
            if (!!nextProps.disabled) {
                this.setState({ disabled: true });
            } else {
                this.setState({ disabled: false });
            }

            // shake
            if (nextProps.shake) {
                this.setState({ shake: true });
            } else {
                this.setState({ shake: false });
            }

            // busy
            if (nextProps.busy) {
                this.setState({ busy: true });
            } else {
                this.setState({ busy: false });
            }

            // className
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

            var html = null;

            // if the button shakes stop it!
            if (this.state.shake) {
                setTimeout(function () {
                    this.setState({ shake: false });
                }.bind(this), 1000);
            }

            // if we are not busy show the button
            if (!this.state.busy) {
                html = _react2.default.createElement(
                    'button',
                    { type: 'submit',
                        className: "btn" + (" " + this.state.className || "") + (this.state.shake ? " btn-animate-shake" : " ")
                    },
                    this.props.children
                );
            }
            // else show the busy button
            else {
                    html = _react2.default.createElement(
                        'button',
                        { type: 'submit',
                            className: "btn" + (" " + this.state.className || ""),
                            disabled: true
                        },
                        _react2.default.createElement(_Busy2.default, null)
                    );
                }

            return html;
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
                if (res.status >= 200 && res.status < 300) {
                    // if we receive an auth token we should add this to the storage
                    if (res.headers.has(AUTH_TOKEN_HEADER)) {
                        sessionStorage.setItem(AUTH_TOKEN_HEADER, res.headers.get(AUTH_TOKEN_HEADER));
                    }
                    // if we receive a device token we should add this to the storage
                    if (res.headers.has(DEVICE_TOKEN_HEADER)) {
                        sessionStorage.setItem(DEVICE_TOKEN_HEADER, res.headers.get(DEVICE_TOKEN_HEADER));
                    }

                    return res.json().then(function (json) {
                        return { status: res.status, json: json };
                    }).catch(function (e) {
                        return { status: res.status }; // not really an error. If request wasn't a json request then skip
                    });
                } else {
                    // try to get error message from json
                    return res.json().then(function (json) {
                        return _promise2.default.reject({ status: res.status, json: json });
                    }).catch(function (e) {
                        switch (e.status) {
                            case 401:
                            case 403:
                                sessionStorage.removeItem(AUTH_TOKEN_HEADER);
                                return _promise2.default.reject(e);
                            default:
                                return _promise2.default.reject(e);
                        }
                    });
                }
            })
            //         // todo then we need to add a success handler to the contact form so that people only submit once
            //         // todo then we need to update the forms to allow for subit and error as apposed to just a disabled btn
            .then(function (res) {
                // success
                return { res: res };
            }, function (err) {
                //fail
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


//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UvYWN0aW9ucy9hcGlSZXF1ZXN0QWN0aW9ucy5qcyIsImJhc2UvYmFzZV90bXBsLmpzIiwiYmFzZS9jb21wb25lbnRzL2J1c3kvQnVzeS5qcyIsImJhc2UvY29tcG9uZW50cy9nRm9ybS9HRXJyb3IuanMiLCJiYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR0Zvcm0uanMiLCJiYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR0hpZGRlbi5qcyIsImJhc2UvY29tcG9uZW50cy9nRm9ybS9HSW5wdXQuanMiLCJiYXNlL2NvbXBvbmVudHMvZ0Zvcm0vR1N1Ym1pdC5qcyIsImJhc2UvY29tcG9uZW50cy9nRm9ybS9HVGV4dEFyZWEuanMiLCJiYXNlL2luaXQuanMiLCJiYXNlL3JlZHVjZXJzL2FwaVJlcXVlc3RSZWR1Y2Vycy5qcyIsImJhc2UvcmVkdWNlcnMvcmVkdWNlcnMuanMiLCJiYXNlL3JvdXRlci9yb3V0ZXMuanMiLCJiYXNlL3NhZ2FzL3NhZ2FzLmpzIiwiYmFzZS9zZXJ2aWNlcy9hcGkuanMiLCJiYXNlL3N0b3JlL2NvbmZpZ3VyZVN0b3JlLmpzIiwiaW5pdGlhbGl6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQS9DQTtBQUFBO0NDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBM0ZBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQW5GQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWpGQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhNQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEzREE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUEzSEE7QUFBQTtBQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBdElBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbEhBO0FBQUE7QUNBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFoRUE7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWhFQTtBQUFBO0FDQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBeENBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsQ0E7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBekNBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBbEtBO0FBQUE7Q0NBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFsQ0E7QUFBQTtDQ0FBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFwQ0E7QUFBQSIsImZpbGUiOiIuLi9iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLnJlcXVlc3QgPSByZXF1ZXN0O1xuZXhwb3J0cy5zdWNjZXNzID0gc3VjY2VzcztcbmV4cG9ydHMuZmFpbHVyZSA9IGZhaWx1cmU7XG5leHBvcnRzLnB1cmdlID0gcHVyZ2U7XG52YXIgUkVRVUVTVCA9IGV4cG9ydHMuUkVRVUVTVCA9ICdBUElfUkVRVUVTVCc7XG52YXIgU1VDQ0VTUyA9IGV4cG9ydHMuU1VDQ0VTUyA9ICdBUElfU1VDQ0VTUyc7XG52YXIgRkFJTFVSRSA9IGV4cG9ydHMuRkFJTFVSRSA9ICdBUElfRkFJTCc7XG52YXIgUFVSR0UgPSBleHBvcnRzLlBVUkdFID0gJ0FQSV9QVVJHRSc7XG5cbmZ1bmN0aW9uIHJlcXVlc3Qoa2V5LCBkYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogUkVRVUVTVCxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIHJlcXVlc3RlZEF0OiBEYXRlLm5vdygpXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gc3VjY2VzcyhrZXksIGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBTVUNDRVNTLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgcmVjZWl2ZWRBdDogRGF0ZS5ub3coKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGZhaWx1cmUoa2V5LCBlcnIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBGQUlMVVJFLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgZXJyOiBlcnIsXG4gICAgICAgIHJlY2VpdmVkQXQ6IERhdGUubm93KClcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBwdXJnZShrZXkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBQVVJHRSxcbiAgICAgICAga2V5OiBrZXlcbiAgICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBCYXNlVGVtcGxhdGUgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEJhc2VUZW1wbGF0ZSwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBCYXNlVGVtcGxhdGUocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgQmFzZVRlbXBsYXRlKTtcbiAgICAgICAgcmV0dXJuICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKEJhc2VUZW1wbGF0ZS5fX3Byb3RvX18gfHwgKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoQmFzZVRlbXBsYXRlKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEJhc2VUZW1wbGF0ZSwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5oYW5kbGVSZXNpemUpO1xuXG4gICAgICAgICAgICB2YXIgbG9hZGVyU3R5bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRlci1wYWdlLXdyYXBwZXJcIikuc3R5bGU7XG4gICAgICAgICAgICB2YXIgYXBwU3R5bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcFwiKS5zdHlsZTtcbiAgICAgICAgICAgIGFwcFN0eWxlLm92ZXJmbG93WSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICAvLyB3YWl0IGZvciBlbnRpcmUgZG9tIHRvIGZpbmlzaCBhbmQgdGhlbiBmYWRlIGxvYWRpbmcgc2NyZWVuLlxuICAgICAgICAgICAgd2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGVyU3R5bGUub3BhY2l0eSA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWZ0ZXIgZmFkZSBzdGFydCB3ZSBjYW4gZmFkZSBpbiBhY3R1YWwgc2l0ZVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcFN0eWxlLm92ZXJmbG93WSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBTdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9uY2UgbG9hZGluZyBzY3JlZW4gaXMgY29tcGxldGVseSBnb25lIHdlIGNhbiByZW1vdmUgaXQgZnJvbSBkb20gdmlld1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlclN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgfSwgNzUwKTtcbiAgICAgICAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGlkOiAnZ29jbXMnIH0sXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gQmFzZVRlbXBsYXRlO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuQmFzZVRlbXBsYXRlLnByb3BUeXBlcyA9IHtcbiAgICBjaGlsZHJlbjogX3JlYWN0LlByb3BUeXBlcy5ub2RlXG59O1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUsIG93blByb3BzKSB7XG4gICAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX3JlYWN0UmVkdXguY29ubmVjdCkobWFwU3RhdGVUb1Byb3BzLCB7fSkoQmFzZVRlbXBsYXRlKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJyk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuJyk7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMik7XG5cbnZhciBfaW5oZXJpdHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzJyk7XG5cbnZhciBfaW5oZXJpdHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5oZXJpdHMyKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cCA9IHJlcXVpcmUoJ3JlYWN0LXRyYW5zaXRpb24tZ3JvdXAvQ1NTVHJhbnNpdGlvbkdyb3VwJyk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0NTU1RyYW5zaXRpb25Hcm91cCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHRXJyb3IgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEdFcnJvciwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBHRXJyb3IocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgR0Vycm9yKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChHRXJyb3IuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEdFcnJvcikpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGVyck1lc3NhZ2U6IF90aGlzLnByb3BzLmVyck1lc3NhZ2UgfHwgbnVsbCxcbiAgICAgICAgICAgIHNpemU6IF90aGlzLnByb3BzLnNpemUgfHwgXCIyMHB4XCIsXG4gICAgICAgICAgICBjb2xvcjogX3RoaXMucHJvcHMuY29sb3IgfHwgXCIjMDA2Nzk3XCIsXG4gICAgICAgICAgICBtYXJnaW46IF90aGlzLnByb3BzLm1hcmdpbiB8fCBcIjAgMiVcIlxuICAgICAgICB9O1xuXG4gICAgICAgIF90aGlzLnN0eWxlID0ge1xuICAgICAgICAgICAgd2lkdGg6IF90aGlzLnN0YXRlLnNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IF90aGlzLnN0YXRlLnNpemUsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IF90aGlzLnN0YXRlLmNvbG9yLFxuICAgICAgICAgICAgbWFyZ2luOiBfdGhpcy5zdGF0ZS5tYXJnaW5cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEdFcnJvciwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgICAgICAgICAgaWYgKCEhbmV4dFByb3BzLmVyck1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZXJyTWVzc2FnZTogbmV4dFByb3BzLmVyck1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6ICdidXN5LWxvYWRlci13cmFwcGVyJyB9LFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogJ2J1c3ktbG9hZGVyIGJ1c3ktbG9hZGVyLTEnLCBzdHlsZTogdGhpcy5zdHlsZSB9KSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdidXN5LWxvYWRlciBidXN5LWxvYWRlci0yJywgc3R5bGU6IHRoaXMuc3R5bGUgfSksXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnYnVzeS1sb2FkZXIgYnVzeS1sb2FkZXItMycsIHN0eWxlOiB0aGlzLnN0eWxlIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBHRXJyb3I7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBHRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAgPSByZXF1aXJlKCdyZWFjdC10cmFuc2l0aW9uLWdyb3VwL0NTU1RyYW5zaXRpb25Hcm91cCcpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9DU1NUcmFuc2l0aW9uR3JvdXApO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgR0Vycm9yID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShHRXJyb3IsIF9SZWFjdCRDb21wb25lbnQpO1xuXG4gICAgZnVuY3Rpb24gR0Vycm9yKHByb3BzKSB7XG4gICAgICAgICgwLCBfY2xhc3NDYWxsQ2hlY2szLmRlZmF1bHQpKHRoaXMsIEdFcnJvcik7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoR0Vycm9yLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHRXJyb3IpKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBlcnJNZXNzYWdlOiBfdGhpcy5wcm9wcy5lcnJNZXNzYWdlIHx8IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEdFcnJvciwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgICAgICAgICAgaWYgKCEhbmV4dFByb3BzLmVyck1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZXJyTWVzc2FnZTogbmV4dFByb3BzLmVyck1lc3NhZ2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IFwiZy1lcnJvci1tZXNzYWdlIFwiICsgKHRoaXMucHJvcHMuY2xhc3NOYW1lIHx8IFwiXCIpIH0sXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgIF9DU1NUcmFuc2l0aW9uR3JvdXAyLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgIHsgdHJhbnNpdGlvbk5hbWU6ICdnLWVycm9yLW1lc3NhZ2UtYm94LWFuaW1hdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dDogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dDogNTAwIH0sXG4gICAgICAgICAgICAgICAgICAgICEhdGhpcy5zdGF0ZS5lcnJNZXNzYWdlID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAnaDMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuZXJyTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEdFcnJvcjtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEdFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJyk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuJyk7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMik7XG5cbnZhciBfaW5oZXJpdHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzJyk7XG5cbnZhciBfaW5oZXJpdHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5oZXJpdHMyKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0UmVkdXggPSByZXF1aXJlKCdyZWFjdC1yZWR1eCcpO1xuXG52YXIgX2Zvcm1zeVJlYWN0ID0gcmVxdWlyZSgnZm9ybXN5LXJlYWN0Jyk7XG5cbnZhciBfZm9ybXN5UmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZm9ybXN5UmVhY3QpO1xuXG52YXIgX0dTdWJtaXQgPSByZXF1aXJlKCcuL0dTdWJtaXQnKTtcblxudmFyIF9HU3VibWl0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0dTdWJtaXQpO1xuXG52YXIgX0dJbnB1dCA9IHJlcXVpcmUoJy4vR0lucHV0Jyk7XG5cbnZhciBfR0lucHV0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0dJbnB1dCk7XG5cbnZhciBfR1RleHRBcmVhID0gcmVxdWlyZSgnLi9HVGV4dEFyZWEnKTtcblxudmFyIF9HVGV4dEFyZWEyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfR1RleHRBcmVhKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEdGb3JtID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShHRm9ybSwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBHRm9ybShwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBHRm9ybSk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoR0Zvcm0uX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEdGb3JtKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgc3VibWl0QnV0dG9uSXNEaXNhYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIHN1Ym1pdEJ0bkNsYXNzTmFtZTogX3RoaXMucHJvcHMuc3VibWl0QnRuQ2xhc3NOYW1lIHx8IFwiXCIsXG4gICAgICAgICAgICBzdWJtaXRCdG5TaGFrZTogX3RoaXMucHJvcHMuc3VibWl0QnRuU2hha2UsXG4gICAgICAgICAgICBzdWJtaXRCdG5CdXN5OiBmYWxzZSxcbiAgICAgICAgICAgIGRpcnR5OiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5oYW5kbGVTdWJtaXQgPSBfdGhpcy5oYW5kbGVTdWJtaXQuYmluZChfdGhpcyk7IC8vYmluZCBmdW5jdGlvbiBvbmNlXG4gICAgICAgIF90aGlzLmRpc2FibGVTdWJtaXRCdXR0b24gPSBfdGhpcy5kaXNhYmxlU3VibWl0QnV0dG9uLmJpbmQoX3RoaXMpOyAvL2JpbmQgZnVuY3Rpb24gb25jZVxuICAgICAgICBfdGhpcy5lbmFibGVTdWJtaXRCdXR0b24gPSBfdGhpcy5lbmFibGVTdWJtaXRCdXR0b24uYmluZChfdGhpcyk7IC8vYmluZCBmdW5jdGlvbiBvbmNlXG5cbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEdGb3JtLCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgICAgICBpZiAoISFuZXh0UHJvcHMuc3VibWl0QnRuQ2xhc3NOYW1lICYmIG5leHRQcm9wcy5zdWJtaXRCdG5DbGFzc05hbWUgIT0gdGhpcy5wcm9wcy5zdWJtaXRCdG5DbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc3VibWl0QnRuQ2xhc3NOYW1lOiBuZXh0UHJvcHMuc3VibWl0QnRuQ2xhc3NOYW1lIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBidXN5IGJ1dHRvblxuICAgICAgICAgICAgaWYgKG5leHRQcm9wcy5zdWJtaXRCdG5CdXN5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ0bkJ1c3k6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEJ0bkJ1c3k6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNoYWtlIGJ1dHRvblxuICAgICAgICAgICAgaWYgKG5leHRQcm9wcy5zdWJtaXRCdG5TaGFrZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXRCdG5TaGFrZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0QnRuU2hha2U6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7fVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnZW5hYmxlU3VibWl0QnV0dG9uJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGVuYWJsZVN1Ym1pdEJ1dHRvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdWJtaXRCdXR0b25Jc0Rpc2FibGVkOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnZGlzYWJsZVN1Ym1pdEJ1dHRvbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNhYmxlU3VibWl0QnV0dG9uKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN1Ym1pdEJ1dHRvbklzRGlzYWJsZWQ6IHRydWUgfSk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRsZVN1Ym1pdCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVTdWJtaXQobW9kZWwpIHtcbiAgICAgICAgICAgIGlmICghIXRoaXMucHJvcHMub25TdWJtaXQpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBidXR0b24gaXMgXCJkaXNhYmxlZFwiIHRoZW4gZG9uJ3QgYWxsb3cgZm9ybSB0byBzdWJtaXQuIEluc3RlYWQgc2hvdyBlcnJvci5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zdWJtaXRCdXR0b25Jc0Rpc2FibGVkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJtaXRCdG5TaGFrZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcnR5OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyByZXN0IGJ1dHRvbiBzaGFrZSBhZnRlciAxIHNlY29uZFxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdWJtaXRCdG5TaGFrZTogZmFsc2UgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBzdWJtaXRcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMub25TdWJtaXQobW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN1Ym1pdEJ0bkJ1c3k6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHZhciBpc0RpcnR5ID0gdGhpcy5zdGF0ZS5kaXJ0eTtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbldpdGhQcm9wcyA9IF9yZWFjdDIuZGVmYXVsdC5DaGlsZHJlbi5tYXAodGhpcy5wcm9wcy5jaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEhY2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgZ29jbXMgZm9ybSB0eXBlXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC50eXBlID09IF9HSW5wdXQyLmRlZmF1bHQgfHwgY2hpbGQudHlwZSA9PSBfR1RleHRBcmVhMi5kZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNsb25lRWxlbWVudChjaGlsZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcnR5OiBpc0RpcnR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogY2hpbGQucHJvcHMua2V5XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIHBhc3MgdGhyb3VnaFxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNsb25lRWxlbWVudChjaGlsZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGNoaWxkLnByb3BzLmtleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgX2Zvcm1zeVJlYWN0Mi5kZWZhdWx0LkZvcm0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5wcm9wcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiZ0Zvcm0gXCIgKyAodGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgXCJcIiksXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMucHJvcHMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgb25TdWJtaXQ6IHRoaXMuaGFuZGxlU3VibWl0LFxuICAgICAgICAgICAgICAgICAgICBvblZhbGlkOiB0aGlzLmVuYWJsZVN1Ym1pdEJ1dHRvbixcbiAgICAgICAgICAgICAgICAgICAgb25JbnZhbGlkOiB0aGlzLmRpc2FibGVTdWJtaXRCdXR0b24sXG4gICAgICAgICAgICAgICAgICAgIGZvcm1Ob1ZhbGlkYXRlOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5XaXRoUHJvcHMsXG4gICAgICAgICAgICAgICAgIXRoaXMucHJvcHMuc3VibWl0QnRuID8gXCJcIiA6IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICBfR1N1Ym1pdDIuZGVmYXVsdCxcbiAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3VibWl0JywgY2xhc3NOYW1lOiB0aGlzLnN0YXRlLnN1Ym1pdEJ0bkNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWtlOiB0aGlzLnN0YXRlLnN1Ym1pdEJ0blNoYWtlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnVzeTogdGhpcy5zdGF0ZS5zdWJtaXRCdG5CdXN5XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc3VibWl0QnRuXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gR0Zvcm07XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcbiAgICByZXR1cm4ge307XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfcmVhY3RSZWR1eC5jb25uZWN0KShtYXBTdGF0ZVRvUHJvcHMsIHt9KShHRm9ybSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAgPSByZXF1aXJlKCdyZWFjdC10cmFuc2l0aW9uLWdyb3VwL0NTU1RyYW5zaXRpb25Hcm91cCcpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9DU1NUcmFuc2l0aW9uR3JvdXApO1xuXG52YXIgX2Zvcm1zeVJlYWN0ID0gcmVxdWlyZSgnZm9ybXN5LXJlYWN0Jyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHSGlkZGVuID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShHSGlkZGVuLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEdIaWRkZW4ocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgR0hpZGRlbik7XG4gICAgICAgIHJldHVybiAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChHSGlkZGVuLl9fcHJvdG9fXyB8fCAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShHSGlkZGVuKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEdIaWRkZW4sIFt7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgeyB0eXBlOiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLnByb3BzLm5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHRoaXMucHJvcHMuZ2V0VmFsdWUoKSB8fCAnJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEdIaWRkZW47XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX2Zvcm1zeVJlYWN0LkhPQykoR0hpZGRlbik7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZicpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvcG9zc2libGVDb25zdHJ1Y3RvclJldHVybicpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjIpO1xuXG52YXIgX2luaGVyaXRzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9pbmhlcml0cycpO1xuXG52YXIgX2luaGVyaXRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luaGVyaXRzMik7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9DU1NUcmFuc2l0aW9uR3JvdXAgPSByZXF1aXJlKCdyZWFjdC10cmFuc2l0aW9uLWdyb3VwL0NTU1RyYW5zaXRpb25Hcm91cCcpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9DU1NUcmFuc2l0aW9uR3JvdXApO1xuXG52YXIgX2Zvcm1zeVJlYWN0ID0gcmVxdWlyZSgnZm9ybXN5LXJlYWN0Jyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHSW5wdXQgPSBmdW5jdGlvbiAoX1JlYWN0JENvbXBvbmVudCkge1xuICAgICgwLCBfaW5oZXJpdHMzLmRlZmF1bHQpKEdJbnB1dCwgX1JlYWN0JENvbXBvbmVudCk7XG5cbiAgICBmdW5jdGlvbiBHSW5wdXQocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgR0lucHV0KTtcblxuICAgICAgICB2YXIgX3RoaXMgPSAoMCwgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4zLmRlZmF1bHQpKHRoaXMsIChHSW5wdXQuX19wcm90b19fIHx8ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKEdJbnB1dCkpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGJsdXJyZWQ6IGZhbHNlLFxuICAgICAgICAgICAgZGlydHk6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIF90aGlzLmNoYW5nZVZhbHVlID0gX3RoaXMuY2hhbmdlVmFsdWUuYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLmhhbmRlbEJsdXIgPSBfdGhpcy5oYW5kZWxCbHVyLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5lbmFibGVTdWJtaXRCdXR0b24gPSBfdGhpcy5jaGFuZ2VWYWx1ZS5iaW5kKF90aGlzKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEdJbnB1dCwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgICAgICAgICAgaWYgKCEhbmV4dFByb3BzLmRpcnR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRpcnR5OiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjaGFuZ2VWYWx1ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGFuZ2VWYWx1ZShldmVudCkge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5zZXRWYWx1ZShldmVudC5jdXJyZW50VGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGFuZGVsQmx1cicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kZWxCbHVyKCkge1xuICAgICAgICAgICAgaWYgKCEhdGhpcy5wcm9wcy5nZXRWYWx1ZSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJsdXJyZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBibHVycmVkOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLnByb3BzLnNob3dSZXF1aXJlZCgpID8gJ2ctaW5wdXQtcmVxdWlyZWQnIDogdGhpcy5wcm9wcy5zaG93RXJyb3IoKSA/ICdnLWlucHV0LWVycm9yJyA6IG51bGw7XG5cbiAgICAgICAgICAgIC8vIEFuIGVycm9yIG1lc3NhZ2UgaXMgcmV0dXJuZWQgT05MWSBpZiB0aGUgY29tcG9uZW50IGlzIGludmFsaWRcbiAgICAgICAgICAgIC8vIG9yIHRoZSBzZXJ2ZXIgaGFzIHJldHVybmVkIGFuIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmJsdXJyZWQgJiYgdGhpcy5wcm9wcy5nZXRFcnJvck1lc3NhZ2UoKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IHRoaXMucHJvcHMuZ2V0RXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZGlydHkgJiYgdGhpcy5wcm9wcy5zaG93UmVxdWlyZWQoKSkge1xuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IFwiKlJlcXVpcmVkXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogXCJnLWNvbnRhaW5lci1jb2wgZy1pbnB1dCBcIiArICh0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCBcIlwiKSB9LFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgICAgICAgICB7IGh0bWxGb3I6IHRoaXMucHJvcHMubmFtZSB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIF9DU1NUcmFuc2l0aW9uR3JvdXAyLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRyYW5zaXRpb25OYW1lOiAnZy1pbnB1dC1lcnJvci1tZXNzYWdlLWFuaW1hdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ6IDUwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0OiA1MDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSAhPSBcIlwiID8gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3NwYW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY2xhc3NOYW1lOiAnZy1pbnB1dC1lcnJvci1tZXNzYWdlJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JywgeyB0eXBlOiB0aGlzLnByb3BzLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMucHJvcHMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U6IHRoaXMuY2hhbmdlVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIG9uQmx1cjogdGhpcy5oYW5kZWxCbHVyLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGhpcy5wcm9wcy5nZXRWYWx1ZSgpIHx8ICcnXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEdJbnB1dDtcbn0oX3JlYWN0Mi5kZWZhdWx0LkNvbXBvbmVudCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfZm9ybXN5UmVhY3QuSE9DKShHSW5wdXQpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YnKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2syID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzQ2FsbENoZWNrJyk7XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2szID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2xhc3NDYWxsQ2hlY2syKTtcblxudmFyIF9jcmVhdGVDbGFzczIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MnKTtcblxudmFyIF9jcmVhdGVDbGFzczMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVDbGFzczIpO1xuXG52YXIgX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4nKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4yKTtcblxudmFyIF9pbmhlcml0czIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMnKTtcblxudmFyIF9pbmhlcml0czMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmhlcml0czIpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfQnVzeSA9IHJlcXVpcmUoJy4uL2J1c3kvQnVzeScpO1xuXG52YXIgX0J1c3kyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQnVzeSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbnZhciBHU3VibWl0ID0gZnVuY3Rpb24gKF9SZWFjdCRDb21wb25lbnQpIHtcbiAgICAoMCwgX2luaGVyaXRzMy5kZWZhdWx0KShHU3VibWl0LCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEdTdWJtaXQocHJvcHMpIHtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgR1N1Ym1pdCk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gKDAsIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMy5kZWZhdWx0KSh0aGlzLCAoR1N1Ym1pdC5fX3Byb3RvX18gfHwgKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoR1N1Ym1pdCkpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIHNoYWtlOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc2FibGVkOiBfdGhpcy5wcm9wcy5kaXNhYmxlZCxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogX3RoaXMucHJvcHMuY2xhc3NOYW1lIHx8IFwiXCIsXG4gICAgICAgICAgICBidXN5OiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShHU3VibWl0LCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgICAgICAvLyBkaXNhYmxlZFxuICAgICAgICAgICAgaWYgKCEhbmV4dFByb3BzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRpc2FibGVkOiB0cnVlIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGlzYWJsZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzaGFrZVxuICAgICAgICAgICAgaWYgKG5leHRQcm9wcy5zaGFrZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaGFrZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNoYWtlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYnVzeVxuICAgICAgICAgICAgaWYgKG5leHRQcm9wcy5idXN5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJ1c3k6IHRydWUgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBidXN5OiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2xhc3NOYW1lXG4gICAgICAgICAgICBpZiAoISFuZXh0UHJvcHMuY2xhc3NOYW1lICYmIG5leHRQcm9wcy5jbGFzc05hbWUgIT0gdGhpcy5zdGF0ZS5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY2xhc3NOYW1lOiBuZXh0UHJvcHMuY2xhc3NOYW1lIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHt9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuXG4gICAgICAgICAgICB2YXIgaHRtbCA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSBidXR0b24gc2hha2VzIHN0b3AgaXQhXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaGFrZSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hha2U6IGZhbHNlIH0pO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMTAwMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHdlIGFyZSBub3QgYnVzeSBzaG93IHRoZSBidXR0b25cbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5idXN5KSB7XG4gICAgICAgICAgICAgICAgaHRtbCA9IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3VibWl0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG5cIiArIChcIiBcIiArIHRoaXMuc3RhdGUuY2xhc3NOYW1lIHx8IFwiXCIpICsgKHRoaXMuc3RhdGUuc2hha2UgPyBcIiBidG4tYW5pbWF0ZS1zaGFrZVwiIDogXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZSBzaG93IHRoZSBidXN5IGJ1dHRvblxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgICdidXR0b24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3VibWl0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuXCIgKyAoXCIgXCIgKyB0aGlzLnN0YXRlLmNsYXNzTmFtZSB8fCBcIlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9CdXN5Mi5kZWZhdWx0LCBudWxsKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEdTdWJtaXQ7XG59KF9yZWFjdDIuZGVmYXVsdC5Db21wb25lbnQpO1xuXG5mdW5jdGlvbiBtYXBTdGF0ZVRvUHJvcHMoc3RhdGUpIHtcbiAgICByZXR1cm4ge307XG59XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfcmVhY3RSZWR1eC5jb25uZWN0KShtYXBTdGF0ZVRvUHJvcHMsIHt9KShHU3VibWl0KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mJyk7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjaycpO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsYXNzQ2FsbENoZWNrMik7XG5cbnZhciBfY3JlYXRlQ2xhc3MyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzJyk7XG5cbnZhciBfY3JlYXRlQ2xhc3MzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlQ2xhc3MyKTtcblxudmFyIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuJyk7XG5cbnZhciBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuMik7XG5cbnZhciBfaW5oZXJpdHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzJyk7XG5cbnZhciBfaW5oZXJpdHMzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaW5oZXJpdHMyKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX0NTU1RyYW5zaXRpb25Hcm91cCA9IHJlcXVpcmUoJ3JlYWN0LXRyYW5zaXRpb24tZ3JvdXAvQ1NTVHJhbnNpdGlvbkdyb3VwJyk7XG5cbnZhciBfQ1NTVHJhbnNpdGlvbkdyb3VwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0NTU1RyYW5zaXRpb25Hcm91cCk7XG5cbnZhciBfZm9ybXN5UmVhY3QgPSByZXF1aXJlKCdmb3Jtc3ktcmVhY3QnKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIEdUZXh0QXJlYSA9IGZ1bmN0aW9uIChfUmVhY3QkQ29tcG9uZW50KSB7XG4gICAgKDAsIF9pbmhlcml0czMuZGVmYXVsdCkoR1RleHRBcmVhLCBfUmVhY3QkQ29tcG9uZW50KTtcblxuICAgIGZ1bmN0aW9uIEdUZXh0QXJlYShwcm9wcykge1xuICAgICAgICAoMCwgX2NsYXNzQ2FsbENoZWNrMy5kZWZhdWx0KSh0aGlzLCBHVGV4dEFyZWEpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9ICgwLCBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybjMuZGVmYXVsdCkodGhpcywgKEdUZXh0QXJlYS5fX3Byb3RvX18gfHwgKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoR1RleHRBcmVhKSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgYmx1cnJlZDogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgICAgX3RoaXMuY2hhbmdlVmFsdWUgPSBfdGhpcy5jaGFuZ2VWYWx1ZS5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuaGFuZGVsQmx1ciA9IF90aGlzLmhhbmRlbEJsdXIuYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLmVuYWJsZVN1Ym1pdEJ1dHRvbiA9IF90aGlzLmNoYW5nZVZhbHVlLmJpbmQoX3RoaXMpO1xuXG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG5cbiAgICAoMCwgX2NyZWF0ZUNsYXNzMy5kZWZhdWx0KShHVGV4dEFyZWEsIFt7XG4gICAgICAgIGtleTogJ2NoYW5nZVZhbHVlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoYW5nZVZhbHVlKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLnNldFZhbHVlKGV2ZW50LmN1cnJlbnRUYXJnZXQudmFsdWUpO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdoYW5kZWxCbHVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRlbEJsdXIoKSB7XG4gICAgICAgICAgICBpZiAoISF0aGlzLnByb3BzLmdldFZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYmx1cnJlZDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGJsdXJyZWQ6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMucHJvcHMuc2hvd1JlcXVpcmVkKCkgPyAnZy10ZXh0LWFyZWEtcmVxdWlyZWQnIDogdGhpcy5wcm9wcy5zaG93RXJyb3IoKSA/ICdnLXRleHQtYXJlYS1lcnJvcicgOiBudWxsO1xuXG4gICAgICAgICAgICAvLyBBbiBlcnJvciBtZXNzYWdlIGlzIHJldHVybmVkIE9OTFkgaWYgdGhlIGNvbXBvbmVudCBpcyBpbnZhbGlkXG4gICAgICAgICAgICAvLyBvciB0aGUgc2VydmVyIGhhcyByZXR1cm5lZCBhbiBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICB2YXIgZXJyb3JNZXNzYWdlID0gW107XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5ibHVycmVkICYmIHRoaXMucHJvcHMuZ2V0RXJyb3JNZXNzYWdlKCkpIHtcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSB0aGlzLnByb3BzLmdldEVycm9yTWVzc2FnZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgeyBjbGFzc05hbWU6IFwiZy1jb250YWluZXItY29sIGctdGV4dC1hcmVhIFwiICsgKGNsYXNzTmFtZSB8fCBcIlwiKSB9LFxuICAgICAgICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgICAgICAgICB7IGh0bWxGb3I6IHRoaXMucHJvcHMubmFtZSB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmxhYmVsLFxuICAgICAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgICAgICAgICAgICAgIF9DU1NUcmFuc2l0aW9uR3JvdXAyLmRlZmF1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHRyYW5zaXRpb25OYW1lOiAnZy10ZXh0LWFyZWEtZXJyb3ItbWVzc2FnZS1hbmltYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0OiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dDogNTAwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgIT0gXCJcIiA/IF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzcGFuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNsYXNzTmFtZTogJ2ctdGV4dC1hcmVhLWVycm9yLW1lc3NhZ2UnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogbnVsbFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnLCB7IHR5cGU6IHRoaXMucHJvcHMudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdGhpcy5wcm9wcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTogdGhpcy5jaGFuZ2VWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgb25CbHVyOiB0aGlzLmhhbmRlbEJsdXIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmdldFZhbHVlKCkgfHwgJydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gR1RleHRBcmVhO1xufShfcmVhY3QyLmRlZmF1bHQuQ29tcG9uZW50KTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9mb3Jtc3lSZWFjdC5IT0MpKEdUZXh0QXJlYSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMucnVuID0gcnVuO1xuZXhwb3J0cy5nZXRTdG9yZSA9IGdldFN0b3JlO1xuZXhwb3J0cy5pbmplY3RNb2R1bGUgPSBpbmplY3RNb2R1bGU7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdERvbSA9IHJlcXVpcmUoJ3JlYWN0LWRvbScpO1xuXG52YXIgX3NhZ2FzID0gcmVxdWlyZSgnLi9zYWdhcy9zYWdhcycpO1xuXG52YXIgX3JvdXRlcyA9IHJlcXVpcmUoJy4vcm91dGVyL3JvdXRlcycpO1xuXG52YXIgX3JlZHVjZXJzID0gcmVxdWlyZSgnLi9yZWR1Y2Vycy9yZWR1Y2VycycpO1xuXG52YXIgX3JlYWN0Um91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbnZhciBfcmVhY3RSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJlZHV4Jyk7XG5cbnZhciBfcmVhY3RSb3V0ZXJSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlci1yZWR1eCcpO1xuXG52YXIgX2NvbmZpZ3VyZVN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZS9jb25maWd1cmVTdG9yZScpO1xuXG52YXIgX2NvbmZpZ3VyZVN0b3JlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbmZpZ3VyZVN0b3JlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIHN0b3JlID0gbnVsbDtcbnZhciBoaXN0b3J5ID0gbnVsbDtcbnZhciByb3V0ZXMgPSBudWxsO1xuXG4vLyByZWd1bGFyIHJlbmRlclxuZnVuY3Rpb24gcnVuKCkge1xuICAgIC8vIGluaXQgc3RvcmUsIHNhZ2FzLCBoaXN0b3J5LCBhbmQgcm91dGVzXG4gICAgc3RvcmUgPSAoMCwgX2NvbmZpZ3VyZVN0b3JlMi5kZWZhdWx0KSh3aW5kb3cuX19JTklUSUFMX1NUQVRFX18sICgwLCBfcmVkdWNlcnMucm9vdFJlZHVjZXIpKCkpO1xuICAgIHN0b3JlLnJ1blNhZ2EoKDAsIF9zYWdhcy5yb290U2FnYSkoKSwgc3RvcmUuZGlzcGF0Y2gpO1xuICAgIGhpc3RvcnkgPSAoMCwgX3JlYWN0Um91dGVyUmVkdXguc3luY0hpc3RvcnlXaXRoU3RvcmUpKF9yZWFjdFJvdXRlci5icm93c2VySGlzdG9yeSwgc3RvcmUpO1xuICAgIHJvdXRlcyA9ICgwLCBfcm91dGVzLnJlZ2lzdGVyZWRSb3V0ZXMpKCk7XG5cbiAgICAvLyByZW5kZXIgb3V0IGRvY1xuICAgICgwLCBfcmVhY3REb20ucmVuZGVyKShfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgX3JlYWN0UmVkdXguUHJvdmlkZXIsXG4gICAgICAgIHsgc3RvcmU6IHN0b3JlIH0sXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9yZWFjdFJvdXRlci5Sb3V0ZXIsIHsgb25VcGRhdGU6IGZ1bmN0aW9uIG9uVXBkYXRlKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgICAgICAgICB9LCBoaXN0b3J5OiBoaXN0b3J5LCByb3V0ZXM6IHJvdXRlcyB9KVxuICAgICksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XG59XG5cbmZ1bmN0aW9uIGdldFN0b3JlKCkge1xuICAgIHJldHVybiBzdG9yZTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0TW9kdWxlKGEpIHtcbiAgICAoMCwgX3NhZ2FzLmluamVjdFNhZ2FzKShhLnNhZ2FzKTtcbiAgICAoMCwgX3JvdXRlcy5pbmplY3RSb3V0ZXMpKGEucm91dGVzKTtcbiAgICAoMCwgX3JlZHVjZXJzLmluamVjdFJlZHVjZXJzKShhLnJlZHVjZXJzKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9kZWZpbmVQcm9wZXJ0eScpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5Mik7XG5cbnZhciBfZXh0ZW5kczUgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvZXh0ZW5kcycpO1xuXG52YXIgX2V4dGVuZHM2ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZXh0ZW5kczUpO1xuXG52YXIgX3JlZHV4ID0gcmVxdWlyZSgncmVkdXgnKTtcblxudmFyIF9hcGlSZXF1ZXN0QWN0aW9ucyA9IHJlcXVpcmUoJy4uL2FjdGlvbnMvYXBpUmVxdWVzdEFjdGlvbnMnKTtcblxudmFyIGFjdGlvbnMgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfYXBpUmVxdWVzdEFjdGlvbnMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBhcGlSZXF1ZXN0UmVkdWNlcigpIHtcbiAgICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBhY3Rpb24gPSBhcmd1bWVudHNbMV07XG5cbiAgICB2YXIga2V5ID0gYWN0aW9uLmtleTtcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgYWN0aW9ucy5SRVFVRVNUOlxuICAgICAgICAgICAgcmV0dXJuICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlLCAoMCwgX2RlZmluZVByb3BlcnR5My5kZWZhdWx0KSh7fSwga2V5LCAoMCwgX2V4dGVuZHM2LmRlZmF1bHQpKHt9LCBzdGF0ZVtrZXldLCB7XG4gICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4gICAgICAgICAgICAgICAgcmVxdWVzdGVkQXQ6IGFjdGlvbi5yZXF1ZXN0ZWRBdFxuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgY2FzZSBhY3Rpb25zLlNVQ0NFU1M6XG4gICAgICAgICAgICByZXR1cm4gKDAsIF9leHRlbmRzNi5kZWZhdWx0KSh7fSwgc3RhdGUsICgwLCBfZGVmaW5lUHJvcGVydHkzLmRlZmF1bHQpKHt9LCBrZXksICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlW2tleV0sIHtcbiAgICAgICAgICAgICAgICBrZXk6IGFjdGlvbi5rZXksXG4gICAgICAgICAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWRBdDogYWN0aW9uLnJlY2VpdmVkQXQsXG4gICAgICAgICAgICAgICAgZGF0YTogYWN0aW9uLmRhdGFcbiAgICAgICAgICAgIH0pKSk7XG4gICAgICAgIGNhc2UgYWN0aW9ucy5GQUlMVVJFOlxuICAgICAgICAgICAgcmV0dXJuICgwLCBfZXh0ZW5kczYuZGVmYXVsdCkoe30sIHN0YXRlLCAoMCwgX2RlZmluZVByb3BlcnR5My5kZWZhdWx0KSh7fSwga2V5LCAoMCwgX2V4dGVuZHM2LmRlZmF1bHQpKHt9LCBzdGF0ZVtrZXldLCB7XG4gICAgICAgICAgICAgICAga2V5OiBhY3Rpb24ua2V5LFxuICAgICAgICAgICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkQXQ6IGFjdGlvbi5yZWNlaXZlZEF0LFxuICAgICAgICAgICAgICAgIGVycjogYWN0aW9uLmVyclxuICAgICAgICAgICAgfSkpKTtcbiAgICAgICAgY2FzZSBhY3Rpb25zLlBVUkdFOlxuICAgICAgICAgICAgdmFyIHMgPSAoMCwgX2V4dGVuZHM2LmRlZmF1bHQpKHt9LCBzdGF0ZSk7XG4gICAgICAgICAgICBkZWxldGUgc1trZXldO1xuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuXG52YXIgYXBpUmVxdWVzdFJlZHVjZXJzID0gKDAsIF9yZWR1eC5jb21iaW5lUmVkdWNlcnMpKHtcbiAgICByZXF1ZXN0OiBhcGlSZXF1ZXN0UmVkdWNlclxufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGFwaVJlcXVlc3RSZWR1Y2VycztcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMyID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2V4dGVuZHMnKTtcblxudmFyIF9leHRlbmRzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2V4dGVuZHMyKTtcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnbicpO1xuXG52YXIgX2Fzc2lnbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hc3NpZ24pO1xuXG5leHBvcnRzLmluamVjdFJlZHVjZXJzID0gaW5qZWN0UmVkdWNlcnM7XG5leHBvcnRzLnJvb3RSZWR1Y2VyID0gcm9vdFJlZHVjZXI7XG5cbnZhciBfcmVhY3RSb3V0ZXJSZWR1eCA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlci1yZWR1eCcpO1xuXG52YXIgX3JlZHV4ID0gcmVxdWlyZSgncmVkdXgnKTtcblxudmFyIF9hcGlSZXF1ZXN0UmVkdWNlcnMgPSByZXF1aXJlKCcuL2FwaVJlcXVlc3RSZWR1Y2VycycpO1xuXG52YXIgX2FwaVJlcXVlc3RSZWR1Y2VyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hcGlSZXF1ZXN0UmVkdWNlcnMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaW5qZWN0ZWRSZWR1Y2VycyA9IHt9O1xuXG5mdW5jdGlvbiBpbmplY3RSZWR1Y2VycyhyKSB7XG4gICAgaW5qZWN0ZWRSZWR1Y2VycyA9ICgwLCBfYXNzaWduMi5kZWZhdWx0KSh7fSwgciwgaW5qZWN0ZWRSZWR1Y2Vycyk7XG59XG5cbmZ1bmN0aW9uIHJvb3RSZWR1Y2VyKCkge1xuICAgIHJldHVybiAoMCwgX3JlZHV4LmNvbWJpbmVSZWR1Y2VycykoKDAsIF9leHRlbmRzMy5kZWZhdWx0KSh7XG4gICAgICAgIGFwaTogX2FwaVJlcXVlc3RSZWR1Y2VyczIuZGVmYXVsdFxuICAgIH0sIGluamVjdGVkUmVkdWNlcnMsIHtcbiAgICAgICAgcm91dGluZzogX3JlYWN0Um91dGVyUmVkdXgucm91dGVyUmVkdWNlclxuICAgIH0pKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5pbmplY3RSb3V0ZXMgPSBpbmplY3RSb3V0ZXM7XG5leHBvcnRzLnJlZ2lzdGVyZWRSb3V0ZXMgPSByZWdpc3RlcmVkUm91dGVzO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3RSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKTtcblxudmFyIF9iYXNlX3RtcGwgPSByZXF1aXJlKCcuLi9iYXNlX3RtcGwnKTtcblxudmFyIF9iYXNlX3RtcGwyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYmFzZV90bXBsKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxudmFyIGluamVjdGVkUm91dGVzID0gW107XG52YXIgcm91dGVzID0gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgX3JlYWN0Um91dGVyLlJvdXRlLFxuICAgIHsgY29tcG9uZW50OiBfYmFzZV90bXBsMi5kZWZhdWx0IH0sXG4gICAgaW5qZWN0ZWRSb3V0ZXNcbik7XG5cbmZ1bmN0aW9uIGluamVjdFJvdXRlcyhyKSB7XG4gICAgaW5qZWN0ZWRSb3V0ZXMucHVzaChyKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJlZFJvdXRlcygpIHtcbiAgICByZXR1cm4gcm91dGVzO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcmVnZW5lcmF0b3IgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yJyk7XG5cbnZhciBfcmVnZW5lcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVnZW5lcmF0b3IpO1xuXG5leHBvcnRzLnJvb3RTYWdhID0gcm9vdFNhZ2E7XG5leHBvcnRzLmluamVjdFNhZ2FzID0gaW5qZWN0U2FnYXM7XG5cbnZhciBfZWZmZWN0cyA9IHJlcXVpcmUoJ3JlZHV4LXNhZ2EvZWZmZWN0cycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgaW5qZWN0ZWRTYWdhcyA9IFtdO1xudmFyIHNhZ2FzID0gW107XG5cbmZ1bmN0aW9uIHJvb3RTYWdhKCkge1xuICAgIHJldHVybiBfcmVnZW5lcmF0b3IyLmRlZmF1bHQubWFyayhmdW5jdGlvbiBfY2FsbGVlKCkge1xuICAgICAgICByZXR1cm4gX3JlZ2VuZXJhdG9yMi5kZWZhdWx0LndyYXAoZnVuY3Rpb24gX2NhbGxlZSQoX2NvbnRleHQpIHtcbiAgICAgICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfY29udGV4dC5wcmV2ID0gX2NvbnRleHQubmV4dCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBfY29udGV4dC5uZXh0ID0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXS5jb25jYXQoaW5qZWN0ZWRTYWdhcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jb250ZXh0LnN0b3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIF9jYWxsZWUsIHRoaXMpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbmplY3RTYWdhcyhzKSB7XG4gICAgaW5qZWN0ZWRTYWdhcy5wdXNoKCgwLCBfZWZmZWN0cy5mb3JrKShzKSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuRU5EUE9JTlRTID0gZXhwb3J0cy5VU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSBleHBvcnRzLkRFVklDRV9UT0tFTl9IRUFERVIgPSBleHBvcnRzLkFVVEhfVE9LRU5fSEVBREVSID0gdW5kZWZpbmVkO1xuXG52YXIgX3N0cmluZ2lmeSA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeScpO1xuXG52YXIgX3N0cmluZ2lmeTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdpZnkpO1xuXG52YXIgX3Byb21pc2UgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2NvcmUtanMvcHJvbWlzZScpO1xuXG52YXIgX3Byb21pc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvbWlzZSk7XG5cbnZhciBfYXNzaWduID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9hc3NpZ24nKTtcblxudmFyIF9hc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXNzaWduKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazIgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2snKTtcblxudmFyIF9jbGFzc0NhbGxDaGVjazMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jbGFzc0NhbGxDaGVjazIpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMiA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGVDbGFzcycpO1xuXG52YXIgX2NyZWF0ZUNsYXNzMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZUNsYXNzMik7XG5cbmV4cG9ydHMuR2V0ID0gR2V0O1xuZXhwb3J0cy5Qb3N0ID0gUG9zdDtcbmV4cG9ydHMuUHV0ID0gUHV0O1xuZXhwb3J0cy5EZWxldGUgPSBEZWxldGU7XG5cbnZhciBfaXNvbW9ycGhpY0ZldGNoID0gcmVxdWlyZSgnaXNvbW9ycGhpYy1mZXRjaCcpO1xuXG52YXIgX2lzb21vcnBoaWNGZXRjaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pc29tb3JwaGljRmV0Y2gpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG52YXIgQVVUSF9UT0tFTl9IRUFERVIgPSBleHBvcnRzLkFVVEhfVE9LRU5fSEVBREVSID0gJ1gtQXV0aC1Ub2tlbic7XG52YXIgREVWSUNFX1RPS0VOX0hFQURFUiA9IGV4cG9ydHMuREVWSUNFX1RPS0VOX0hFQURFUiA9ICdYLURldmljZS1Ub2tlbic7XG52YXIgVVNFUl9EQVRBX1NUT1JBR0VfS0VZID0gZXhwb3J0cy5VU0VSX0RBVEFfU1RPUkFHRV9LRVkgPSAnVVNFUl9EQVRBX1NUT1JBR0VfS0VZJztcbnZhciBFTkRQT0lOVFMgPSBleHBvcnRzLkVORFBPSU5UUyA9IHtcbiAgICBsb2dpbjogXCIvYXBpL2xvZ2luXCJcbn07XG5cbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICB9LFxuICAgIG1vZGU6ICdjb3JzJyxcbiAgICBjYWNoZTogJ2RlZmF1bHQnLFxuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgYm9keTogbnVsbFxufTtcblxudmFyIEFwaSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBcGkodXJsKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgICAgKDAsIF9jbGFzc0NhbGxDaGVjazMuZGVmYXVsdCkodGhpcywgQXBpKTtcblxuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gKDAsIF9hc3NpZ24yLmRlZmF1bHQpKGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBhZGQgYXV0aCBoZWFkZXJzIGlmIHRoZXkgYXJlIHByZXNlbnRcbiAgICAgICAgaWYgKCEhc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShBVVRIX1RPS0VOX0hFQURFUikpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5oZWFkZXJzW0FVVEhfVE9LRU5fSEVBREVSXSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oQVVUSF9UT0tFTl9IRUFERVIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghIXNlc3Npb25TdG9yYWdlLmdldEl0ZW0oREVWSUNFX1RPS0VOX0hFQURFUikpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5oZWFkZXJzW0RFVklDRV9UT0tFTl9IRUFERVJdID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShERVZJQ0VfVE9LRU5fSEVBREVSKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZmV0Y2ggPSBfaXNvbW9ycGhpY0ZldGNoMi5kZWZhdWx0O1xuICAgIH1cblxuICAgICgwLCBfY3JlYXRlQ2xhc3MzLmRlZmF1bHQpKEFwaSwgW3tcbiAgICAgICAga2V5OiAnY2FsbEFwaScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYWxsQXBpKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2godGhpcy51cmwsIHRoaXMub3B0aW9ucykudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPj0gMjAwICYmIHJlcy5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgcmVjZWl2ZSBhbiBhdXRoIHRva2VuIHdlIHNob3VsZCBhZGQgdGhpcyB0byB0aGUgc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmhlYWRlcnMuaGFzKEFVVEhfVE9LRU5fSEVBREVSKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShBVVRIX1RPS0VOX0hFQURFUiwgcmVzLmhlYWRlcnMuZ2V0KEFVVEhfVE9LRU5fSEVBREVSKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgcmVjZWl2ZSBhIGRldmljZSB0b2tlbiB3ZSBzaG91bGQgYWRkIHRoaXMgdG8gdGhlIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5oZWFkZXJzLmhhcyhERVZJQ0VfVE9LRU5fSEVBREVSKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShERVZJQ0VfVE9LRU5fSEVBREVSLCByZXMuaGVhZGVycy5nZXQoREVWSUNFX1RPS0VOX0hFQURFUikpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCkudGhlbihmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiByZXMuc3RhdHVzLCBqc29uOiBqc29uIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHJlcy5zdGF0dXMgfTsgLy8gbm90IHJlYWxseSBhbiBlcnJvci4gSWYgcmVxdWVzdCB3YXNuJ3QgYSBqc29uIHJlcXVlc3QgdGhlbiBza2lwXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRyeSB0byBnZXQgZXJyb3IgbWVzc2FnZSBmcm9tIGpzb25cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCkudGhlbihmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9wcm9taXNlMi5kZWZhdWx0LnJlamVjdCh7IHN0YXR1czogcmVzLnN0YXR1cywganNvbjoganNvbiB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZS5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQwMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShBVVRIX1RPS0VOX0hFQURFUik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcHJvbWlzZTIuZGVmYXVsdC5yZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9wcm9taXNlMi5kZWZhdWx0LnJlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vICAgICAgICAgLy8gdG9kbyB0aGVuIHdlIG5lZWQgdG8gYWRkIGEgc3VjY2VzcyBoYW5kbGVyIHRvIHRoZSBjb250YWN0IGZvcm0gc28gdGhhdCBwZW9wbGUgb25seSBzdWJtaXQgb25jZVxuICAgICAgICAgICAgLy8gICAgICAgICAvLyB0b2RvIHRoZW4gd2UgbmVlZCB0byB1cGRhdGUgdGhlIGZvcm1zIHRvIGFsbG93IGZvciBzdWJpdCBhbmQgZXJyb3IgYXMgYXBwb3NlZCB0byBqdXN0IGEgZGlzYWJsZWQgYnRuXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgLy8gc3VjY2Vzc1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHJlczogcmVzIH07XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgLy9mYWlsXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiBlcnIgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfV0pO1xuICAgIHJldHVybiBBcGk7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEFwaTtcbmZ1bmN0aW9uIEdldCh1cmwpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICBvcHRpb25zLm1ldGhvZCA9IFwiR0VUXCI7XG4gICAgcmV0dXJuIG5ldyBBcGkodXJsLCBvcHRpb25zKS5jYWxsQXBpKCk7XG59XG5cbmZ1bmN0aW9uIFBvc3QodXJsLCBib2R5KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgb3B0aW9ucy5tZXRob2QgPSBcIlBPU1RcIjtcblxuICAgIC8vIHN0cmluZ2lmeSBib2R5IGlmIG5lZWRlZFxuICAgIGlmICghIWJvZHkpIHtcbiAgICAgICAgb3B0aW9ucy5ib2R5ID0gKDAsIF9zdHJpbmdpZnkyLmRlZmF1bHQpKGJvZHkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEFwaSh1cmwsIG9wdGlvbnMpLmNhbGxBcGkoKTtcbn1cblxuZnVuY3Rpb24gUHV0KHVybCwgYm9keSkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICAgIG9wdGlvbnMubWV0aG9kID0gXCJQVVRcIjtcblxuICAgIC8vIHN0cmluZ2lmeSBib2R5IGlmIG5lZWRlZFxuICAgIGlmICghIWJvZHkpIHtcbiAgICAgICAgb3B0aW9ucy5ib2R5ID0gKDAsIF9zdHJpbmdpZnkyLmRlZmF1bHQpKGJvZHkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEFwaSh1cmwsIG9wdGlvbnMpLmNhbGxBcGkoKTtcbn1cblxuZnVuY3Rpb24gRGVsZXRlKHVybCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIG9wdGlvbnMubWV0aG9kID0gXCJEZWxldGVcIjtcbiAgICByZXR1cm4gbmV3IEFwaSh1cmwsIG9wdGlvbnMpLmNhbGxBcGkoKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gY29uZmlndXJlU3RvcmU7XG5cbnZhciBfcmVkdXggPSByZXF1aXJlKCdyZWR1eCcpO1xuXG52YXIgX3JlZHV4TG9nZ2VyID0gcmVxdWlyZSgncmVkdXgtbG9nZ2VyJyk7XG5cbnZhciBfcmVkdXhTYWdhID0gcmVxdWlyZSgncmVkdXgtc2FnYScpO1xuXG52YXIgX3JlZHV4U2FnYTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWR1eFNhZ2EpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBjb25maWd1cmVTdG9yZShpbml0aWFsU3RhdGUsIHJvb3RSZWR1Y2VyKSB7XG5cbiAgICB2YXIgc2FnYU1pZGRsZXdhcmUgPSAoMCwgX3JlZHV4U2FnYTIuZGVmYXVsdCkoKTtcbiAgICB2YXIgbG9nZ2VyID0gKDAsIF9yZWR1eExvZ2dlci5jcmVhdGVMb2dnZXIpKHtcbiAgICAgICAgY29sbGFwc2VkOiB0cnVlXG4gICAgfSk7XG5cbiAgICB2YXIgY29tcG9zZUVuaGFuY2VycyA9IHdpbmRvdy5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9DT01QT1NFX18gfHwgX3JlZHV4LmNvbXBvc2U7XG4gICAgdmFyIHN0b3JlID0gKDAsIF9yZWR1eC5jcmVhdGVTdG9yZSkocm9vdFJlZHVjZXIsIGluaXRpYWxTdGF0ZSwgY29tcG9zZUVuaGFuY2VycygoMCwgX3JlZHV4LmFwcGx5TWlkZGxld2FyZSkoc2FnYU1pZGRsZXdhcmUsIGxvZ2dlcikpKTtcblxuICAgIHN0b3JlLnJ1blNhZ2EgPSBzYWdhTWlkZGxld2FyZS5ydW47XG4gICAgc3RvcmUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzdG9yZS5kaXNwYXRjaChfcmVkdXhTYWdhLkVORCk7XG4gICAgfTtcblxuICAgIHJldHVybiBzdG9yZTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5ydW4gPSBydW47XG5mdW5jdGlvbiBydW4od2l0aEFkbWluLCBhY3RpdmVQbHVnaW5zLCBhY3RpdmVUaGVtZSkge1xuXG4gICAgLy8gZmlyc3QgZ2V0IGdvQ01TIGJhc2VcbiAgICB2YXIgZ29DTVNCYXNlID0gcmVxdWlyZSgnLi9iYXNlL2luaXQuanMnKTtcblxuICAgIGlmICghIXdpbmRvdy5NU0lucHV0TWV0aG9kQ29udGV4dCAmJiAhIWRvY3VtZW50LmRvY3VtZW50TW9kZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIklFMTE6IExvYWRpbmcgcHJvbWlzZSBwb2x5ZmlsbFwiKTtcbiAgICAgICAgcmVxdWlyZSgnZXM2LXByb21pc2UnKS5wb2x5ZmlsbCgpO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIHRvIHNlZSBpZiB3ZSBhcmUgbG9hZGluZyBhZG1pbiBzZWN0aW9uXG4gICAgaWYgKCEhd2l0aEFkbWluKSB7XG4gICAgICAgIHZhciBnb0NNU0FkbWluID0gcmVxdWlyZSgnLi9hZG1pbi9pbml0LmpzJykuZGVmYXVsdDtcbiAgICAgICAgZ29DTVNCYXNlLmluamVjdE1vZHVsZShnb0NNU0FkbWluKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFjdGl2ZVBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGFjdGl2ZVBsdWdpbkluaXQgPSBhY3RpdmVQbHVnaW5zW2ldICsgXCIvaW5pdGlhbGl6ZS5qc1wiO1xuICAgICAgICB2YXIgYWN0aXZlUGx1Z2luID0gcmVxdWlyZShhY3RpdmVQbHVnaW5Jbml0KS5kZWZhdWx0O1xuICAgICAgICBnb0NNU0Jhc2UuaW5qZWN0TW9kdWxlKGFjdGl2ZVBsdWdpbik7XG4gICAgfVxuXG4gICAgLy8gbG9hZCB0aGUgdGhlbWVcbiAgICB2YXIgdGhlbWVJbml0ID0gYWN0aXZlVGhlbWUgKyAnL3RoZW1lL2luaXRpYWxpemUuanMnO1xuICAgIHZhciBnb0NNU1RoZW1lID0gcmVxdWlyZSh0aGVtZUluaXQpLmRlZmF1bHQ7XG4gICAgZ29DTVNCYXNlLmluamVjdE1vZHVsZShnb0NNU1RoZW1lKTtcblxuICAgIC8vIHJ1biB0aGUgY21zXG4gICAgZ29DTVNCYXNlLnJ1bigpO1xufVxuIl19