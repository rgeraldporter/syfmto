(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Validation = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Failure = exports.Success = exports.liftAN = undefined;

var _ramda = (typeof window !== "undefined" ? window['R'] : typeof global !== "undefined" ? global['R'] : null);

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var liftAN = function liftAN(n, f) {
    return R.curryN(n,
    // (acc, value) -> .ap is applied for each N, starting with R.head then ...R.tail
    function () {
        for (var _len = arguments.length, validations = Array(_len), _key = 0; _key < _len; _key++) {
            validations[_key] = arguments[_key];
        }

        return R.reduce(function (a, b) {
            return a.ap(b);
        }, R.head(validations).map(R.curryN(n, f)), R.tail(validations));
    });
};

var Success = function Success(x) {
    return {
        map: function map(f) {
            return Success(f(x));
        },
        chain: function chain(f) {
            return f(x);
        },
        fold: function fold(f, g) {
            return f(x);
        },
        inspect: function inspect() {
            return 'Success(' + x + ')';
        },
        ap: function ap(y) {
            return y.isSuccess ? y.map(x) : y;
        },
        isSuccess: true
    };
};

var Failure = function Failure(x) {
    return {
        map: function map(f) {
            return Failure(x);
        },
        chain: function chain(f) {
            return Failure(x);
        },
        fold: function fold(f, g) {
            return g(x);
        },
        inspect: function inspect() {
            return 'Failure(' + x + ')';
        },
        concat: function concat(o) {
            return o.fold(null, function (r) {
                return Failure(x.concat(r));
            });
        },
        ap: function ap(y) {
            return y.isSuccess ? Failure(x) : y.concat(Failure(x));
        },
        isSuccess: false
    };
};

exports.liftAN = liftAN;
exports.Success = Success;
exports.Failure = Failure;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});