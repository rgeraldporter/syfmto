'use strict';

var _index = require('./index');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('The library', function () {
    var validPath = function validPath(response) {
        return _ramda2.default.path(['data'], response) === undefined ? (0, _index.Failure)(['Object has bad path']) : (0, _index.Success)(response);
    };

    var validFormat = function validFormat(response) {
        return _ramda2.default.path(['data'], response) > 0 ? (0, _index.Success)(response) : (0, _index.Failure)(['Value is too low!']);
    };

    var validNoError = function validNoError(response) {
        return _ramda2.default.path(['error'], response) === undefined ? (0, _index.Success)(response) : (0, _index.Failure)(['Error was defined']);
    };

    it('should return a success correctly with 1 validation', function () {
        var response = { data: 1 };
        var result = (0, _index.liftAN)(1, function () {
            return response.data;
        })(validPath(response));

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return a success correctly with 2 validations', function () {
        var response = { data: 1 };
        var result = (0, _index.liftAN)(2, function () {
            return response.data;
        })(validPath(response))(validFormat(response));

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return a success correctly with 3 validations', function () {
        var response = { data: 1 };
        var result = (0, _index.liftAN)(3, function () {
            return response.data;
        })(validPath(response))(validFormat(response))(validNoError(response));

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return a success correctly with 6 validations', function () {
        var response = { data: 1 };
        var result = (0, _index.liftAN)(6, function () {
            return response.data;
        })(validPath(response))(validFormat(response))(validNoError(response))(validPath(response))(validFormat(response))(validNoError(response));

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return two failures correctly', function () {
        var response = { datas: 1 };
        var result = (0, _index.liftAN)(2, function () {
            return response.data;
        })(validPath(response))(validFormat(response));

        expect(result.inspect()).toBe('Failure(Value is too low!,Object has bad path)');
    });

    it('should return three failures correctly', function () {
        var response = { datas: 1, error: true };
        var result = (0, _index.liftAN)(3, function () {
            return response.data;
        })(validPath(response))(validFormat(response))(validNoError(response));

        expect(result.inspect()).toBe('Failure(Error was defined,Value is too low!,Object has bad path)');
    });

    it('should return one failure correctly', function () {
        var response = { data: -1 };
        var result = (0, _index.liftAN)(3, function () {
            return response.data;
        })(validPath(response))(validFormat(response))(validNoError(response));

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });

    it('should return one failure correctly no matter what order it is checked', function () {
        var response = { data: -1 };
        var result = (0, _index.liftAN)(3, function () {
            return response.data;
        })(validPath(response))(validFormat(response))(validNoError(response));

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });

    it('should return one failure correctly with only one validation', function () {
        var response = { data: -1 };
        var result = (0, _index.liftAN)(1, function () {
            return response.data;
        })(validFormat(response));

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });

    var validUsername = function validUsername(username) {
        return username.length > 5 ? (0, _index.Success)(username) : (0, _index.Failure)(['Your username must be over 5 characters long']);
    };

    var validAge = function validAge(age) {
        return age > 13 ? (0, _index.Success)(age) : (0, _index.Failure)(['You must be over 13']);
    };

    var validPassword = function validPassword(password) {
        return (/[A-Z]/.test(password) ? (0, _index.Success)(password) : (0, _index.Failure)(['Your password must include a capital letter'])
        );
    };

    var user = {
        username: 'blahblah',
        age: 17,
        password: '6aNh*89'
    };

    it('should have a functioning success example from the README', function () {
        var result = (0, _index.liftAN)(3, function () {
            return user;
        })(validUsername(user.username))(validAge(user.age))(validPassword(user.password));

        // if "g is not a function" this failed
        result.fold(function (x) {
            return expect(x.age).toBe(17);
        });
        result.fold(function (x) {
            return expect(x.username).toBe('blahblah');
        });
        result.fold(function (x) {
            return expect(x.password).toBe('6aNh*89');
        });
    });

    var user2 = {
        username: 'blah',
        age: 12,
        password: 'badpass'
    };

    it('should have a functioning failure example from the README', function () {
        var result = (0, _index.liftAN)(3, function () {
            return user2;
        })(validUsername(user2.username))(validAge(user2.age))(validPassword(user2.password));

        // if "f is not a function" this failed
        result.fold(null, function (x) {
            return expect(x.toString()).toBe('Your password must include a capital letter,You must be over 13,' + 'Your username must be over 5 characters long');
        });
    });
});