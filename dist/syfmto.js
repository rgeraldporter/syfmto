(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Validation = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = (typeof window !== "undefined" ? window['R'] : typeof global !== "undefined" ? global['R'] : null);

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validation = function () {
    function Validation(value) {
        _classCallCheck(this, Validation);

        this.value = value;
    }

    _createClass(Validation, [{
        key: 'equals',
        value: function equals(that) {
            return that instanceof this.constructor && R.equals(this.value, that.value);
        }
    }, {
        key: 'map',
        value: function map() {
            return this;
        }

        // Validation is Applicative, this method does not satisfy Monad Laws.

    }, {
        key: 'nonMonadicChain',
        value: function nonMonadicChain() {
            return this;
        }
    }, {
        key: 'fold',
        value: function fold(f1, f2) {
            return this.success ? f1(this.value) : f2(this.value);
        }
    }, {
        key: 'isSuccess',
        get: function get() {
            return false;
        }
    }, {
        key: 'isFailure',
        get: function get() {
            return false;
        }
    }], [{
        key: 'of',
        value: function of(value) {
            return new Success(value);
        }
    }, {
        key: 'success',
        value: function success(value) {
            return Validation.of(value);
        }
    }, {
        key: 'failure',
        value: function failure(value) {
            return new Failure(value);
        }
    }, {
        key: 'liftAN',
        value: function liftAN(n, fn) {
            return R.curryN(n, function () {
                for (var _len = arguments.length, validations = Array(_len), _key = 0; _key < _len; _key++) {
                    validations[_key] = arguments[_key];
                }

                return R.reduce(function (a1, a2) {
                    return a1.ap(a2);
                }, R.head(validations).map(R.curry(fn)), R.tail(validations));
            });
        }
    }]);

    return Validation;
}();

var Success = function (_Validation) {
    _inherits(Success, _Validation);

    function Success(x) {
        _classCallCheck(this, Success);

        return _possibleConstructorReturn(this, (Success.__proto__ || Object.getPrototypeOf(Success)).call(this, x));
    }

    _createClass(Success, [{
        key: 'map',
        value: function map(fn) {
            return new Success(fn(this.value));
        }
    }, {
        key: 'ap',
        value: function ap(that) {
            return that.isSuccess ? that.map(this.value) : that;
        }
    }, {
        key: 'nonMonadicChain',
        value: function nonMonadicChain(fn) {
            return fn(this.value);
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'Validation.Success(' + R.toString(this.value) + ')';
        }
    }, {
        key: 'isSuccess',
        get: function get() {
            return true;
        }
    }]);

    return Success;
}(Validation);

var Failure = function (_Validation2) {
    _inherits(Failure, _Validation2);

    function Failure(x) {
        _classCallCheck(this, Failure);

        return _possibleConstructorReturn(this, (Failure.__proto__ || Object.getPrototypeOf(Failure)).call(this, x));
    }

    _createClass(Failure, [{
        key: 'ap',
        value: function ap(that) {
            return that.isSuccess ? this : new Failure(this.value.concat(that.value));
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'Validation.Failure(' + R.toString(this.value) + ')';
        }
    }, {
        key: 'isFailure',
        get: function get() {
            return true;
        }
    }]);

    return Failure;
}(Validation);

module.exports = Validation;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});