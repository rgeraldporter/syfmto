import * as R from 'ramda';

const liftAN = (n, f) => R.curryN(
    n,
    // (acc, value) -> .ap is applied for each N, starting with R.head then ...R.tail
    (...validations) => R.reduce((a, b) => a.ap(b), R.head(validations).map(R.curryN(n, f)), R.tail(validations))
);

const Success = x => ({
    map: f => Success(f(x)),
    chain: f => f(x),
    fold: (f, g) => f(x),
    inspect: () => `Success(${x})`,
    ap: y => y.isSuccess ? y.map(x) : y,
    isSuccess: true
});

const Failure = x => ({
    map: f => Failure(x),
    chain: f => Failure(x),
    fold: (f, g) => g(x),
    inspect: () => `Failure(${x})`,
    concat: o => o.fold(null, r => Failure(x.concat(r))),
    ap: y => y.isSuccess ? Failure(x) : y.concat(Failure(x)),
    isSuccess: false
});

export {liftAN, Success, Failure}