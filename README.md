# Syfmto
### v1.1.0
[![Build Status](https://travis-ci.org/rgeraldporter/syfmto.svg?branch=master)](https://travis-ci.org/rgeraldporter/syfmto)

Syfmto (["sometimes you fail more than once"](http://robotlolita.me/2013/12/08/a-monad-in-practicality-first-class-failures.html#sometimes-you-fail-more-than-once)) is a [Fantasy-land](https://github.com/fantasyland/fantasy-land) compatible validation module built upon Ramda.

This is much like `Left` & `Right` except that it allows the propagation of successive successes or failures via applicative functors.

## But what does any of that mean?

Functional programming can tough to get a grasp of if you're not familiar with it. So I'm hoping the following can act as a better description that isn't too esoteric.

Traditionally in JavaScript you would use `try`, `catch`, and `throw` (or their `Promise`-based equivalents) to handle predicted and non-predicted errors. This can be quite limiting though, allowing only one caught error at a time, and not allowing for more nuanced handling of errors.

Sometimes you might want to know about every error (and not just the first one encountered), and sometimes maybe you want to handle differing combinations of errors in different ways. Perhaps you want to allow some code to execute if there's only one error and not two, or maybe you want to return an error without triggering the skips in logical flow that occur when using `throw` or `Promise.reject()` are encountered.

In short, you want to collect errors like any normal data, and not react to them with alarm and panic.

## How to use

Syfmto imports with three exposed functions: `Success`, `Failure`, and `liftAN`.

`liftAN` is a `lift` in functional programming terms. This function takes `n` number of functions that can only return `Success` or `Failures`, and a function to pass into a `Success` result if no `Failure`s are returned by any of those functions.

```
// n = 2, must line up with the number of functions in the second set of parentheses.
const results = liftAN(2, () => data)( validateData1(data.something), validateData2(data.somethingelse) );
```

In the above, the functions like `validateData1` must return either `Success()` or `Failure([])`. All `Failure` parameters must be in an array, e.g. `Failure(['You must specify your name'])` -- all failures that occur will be concatenated into a final result upon exit of the `liftAN` function.

The final result will be either a `Success` with your value, or a `Failure` with your errors. The values are immutable containers, and you need to apply a `.fold()` call to them to retrieve their contents. The `.fold()` takes two parameters, both functions, the first for `Success`es and the other for `Failure`s.

```
// either you'll have your `data` object, or an array of failures.
const myFinalResult = results.fold(data => data, failures => failures);
```
You might also be using this as part of a Promise chain, and this'll work great with that:

```
// folding to `Promise.resolve` or `Promise.reject()`
.then(
    results => results.fold(
        data => Promise.resolve(data),
        failures => Promise.reject(failures)
    )
);
```

## Example: Validating a user

```
import {liftAN, Success, Failure} from 'syfmto';

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

// Success({ username: 'blahblah', age: 17, password: '6aNh*89' })
const result = liftAN(3, () => user)
    (validUsername(user.username))
    (validAge(user.age))
    (validPassword(user.password));

const user2 = {
    username: 'blah',
    age: 12,
    password: 'badpass'
};

// Failure(['Your password must include a capital letter', 'You must be over 13', 'Your username must be over 5 characters long'])
const result2 = liftAN(3, () => user2)
    (validUsername(user2.username))
    (validAge(user2.age))
    (validPassword(user2.password));
```

You can see the unit test spec files for more examples. If you are familiar with Ramda, `liftAN` is much like `R.curryN` and must specify a value `n` for its arity.

## Roadmap

Not much else is planned for this. Updates may occur, but it is more likely the better documentation will be the sole focus of future versions.

## License

The MIT License (MIT)

Copyright (c) 2017 Robert Gerald Porter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
