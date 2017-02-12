import { liftAN, Success, Failure } from './index';
import R from 'ramda';

describe('The library', () => {
    const validPath = response => R.path([ 'data' ], response) === undefined
        ? Failure([ 'Object has bad path' ])
        : Success(response);

    const validFormat = response => R.path([ 'data' ], response) > 0
        ? Success(response)
        : Failure([ 'Value is too low!' ]);

    it('should return a success correctly', () => {
        const response = { data: 1 };
        const result = liftAN( 2, () => response.data )( validPath(response) )( validFormat(response) );

        expect(result.inspect()).toBe('Success(1)');
    });

    it('should return two failures correctly', () => {
        const response = { datas: 1 };
        const result = liftAN( 2, () => response.data )( validPath(response) )( validFormat(response) );

        expect(result.inspect()).toBe('Failure(Value is too low!,Object has bad path)');
    });

    it('should return one failure correctly', () => {
        const response = { data: -1 };
        const result = liftAN( 2, () => response.data )( validPath(response) )( validFormat(response) );

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });

    it('should return one failure correctly no matter what order it is checked', () => {
        const response = { data: -1 };
        const result = liftAN( 2, () => response.data )( validPath(response) )( validFormat(response) );

        expect(result.inspect()).toBe('Failure(Value is too low!)');
    });
});