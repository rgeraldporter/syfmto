import {liftAN, Success, Failure} from './index';
import R from 'ramda';

describe('The library', () => {
    const validPath = response => R.path([ 'data' ], response) === undefined
        ? Failure([ 'Object has bad path' ])
        : Success(response);

    const validFormat = response => R.path([ 'data' ], response) > 0
        ? Success(response)
        : Failure([ 'Value is too low!' ]);

    const validNoError = response => R.path([ 'error' ], response) === undefined
        ? Success(response)
        : Failure([ 'Error was defined' ]);

    it('should return a success correctly with 1 validation', () => {
        const response = { data: 1 };
        const result = liftAN(1, () => response.data)(validPath(response));

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return a success correctly with 2 validations', () => {
        const response = { data: 1 };
        const result = liftAN(2, () => response.data)(validPath(response))(validFormat(response));

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return a success correctly with 3 validations', () => {
        const response = { data: 1 };
        const result = liftAN(3, () => response.data)(validPath(response))(validFormat(response))(
            validNoError(response)
        );

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return a success correctly with 6 validations', () => {
        const response = { data: 1 };
        const result = liftAN(6, () => response.data)(validPath(response))(validFormat(response))(
            validNoError(response)
        )(validPath(response))(validFormat(response))(validNoError(response));

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return two failures correctly', () => {
        const response = { datas: 1 };
        const result = liftAN(2, () => response.data)(validPath(response))(validFormat(response));

        expect(result.inspect()).toBe('Failure(Value is too low!,Object has bad path)');
    });

    it('should return three failures correctly', () => {
        const response = { datas: 1, error: true };
        const result = liftAN(3, () => response.data)(validPath(response))(validFormat(response))(
            validNoError(response)
        );

        expect(result.inspect()).toBe('Failure(Error was defined,Value is too low!,Object has bad path)');
    });

    it('should return one failure correctly', () => {
        const response = { data: -1 };
        const result = liftAN(3, () => response.data)(validPath(response))(validFormat(response))(
            validNoError(response)
        );

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });

    it('should return one failure correctly no matter what order it is checked', () => {
        const response = { data: -1 };
        const result = liftAN(3, () => response.data)(validPath(response))(validFormat(response))(
            validNoError(response)
        );

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });

    it('should return one failure correctly with only one validation', () => {
        const response = { data: -1 };
        const result = liftAN(1, () => response.data)(validFormat(response));

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });

    const validUsername = username => username.length > 5
        ? Success(username)
        : Failure([ 'Your username must be over 5 characters long' ]);
        
    const validAge = age => age > 13
        ? Success(age)
        : Failure([ 'You must be over 13' ])

    const validPassword = password => (/[A-Z]/).test(password)
        ? Success(password)
        : Failure([ 'Your password must include a capital letter' ]);

    const user = {
        username: 'blahblah',
        age: 17,
        password: '6aNh*89'
    };

    it('should have a functioning success example from the README', () => {
        const result = liftAN(3, () => user)
            (validUsername(user.username))
            (validAge(user.age))
            (validPassword(user.password));

        // if "g is not a function" this failed
        result.fold(x => expect(x.age).toBe(17));
    });

    const user2 = {
        username: 'blah',
        age: 12,
        password: 'badpass'
    };

    it('should have a functioning failure example from the README', () => {
        const result = liftAN(3, () => user2)
            (validUsername(user2.username))
            (validAge(user2.age))
            (validPassword(user2.password));

        // if "f is not a function" this failed
        result.fold(null, x => expect(x.toString())
            .toBe('Your password must include a capital letter,You must be over 13,'+
                'Your username must be over 5 characters long'));
    });

});