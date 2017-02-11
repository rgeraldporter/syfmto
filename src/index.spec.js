import Valdation from './index';
import R from 'ramda';

const Success = Valdation.Success;
const Failure = Valdation.Failure;

describe('The library', () => {

    const validPath = response =>
        R.path(['data'], response) === undefined ?
            Failure(['Object has bad path']) :
            Success(response);

    const validFormat = response =>
        R.path(['data'], response) > 0 ?
            Success(response) :
            Failure(['Value is too low!']);

    it('should return a success correctly', () => {

        const response = { data: 1 };
        const success = R.curryN( 2, () => response.data );

        const result = Success(success)
            .ap(validFormat(response))
            .ap(validPath(response));

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return two failures correctly', () => {

        const response = { datas: 1 };
        const success = R.curryN( 2, () => response.data );

        const result = Success(success)
            .ap(validFormat(response))
            .ap(validPath(response));

        expect(result.inspect()).toBe('Failure(Object has bad path,Value is too low!)');
    });

    it('should return one failure correctly', () => {

        const response = { data: -1 };
        const success = R.curryN( 2, () => response.data );

        const result = Success(success)
            .ap(validFormat(response))
            .ap(validPath(response));

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });


    it('should return one failure correctly no matter what order it is checked', () => {

        const response = { data: -1 };
        const success = R.curryN( 2, () => response.data );

        const result = Success(success)
            .ap(validPath(response))
            .ap(validFormat(response));

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });
});