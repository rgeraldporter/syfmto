'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Failure = exports.Success = exports.liftAN = undefined;

var _ramda = require('ramda');

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
        fmap: function fmap(f) {
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
        fmap: function fmap(f) {
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