# recursive-func

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Create recursive functions with `Y-Combinator` style.
```js
import { recursive } from 'recursive-func'

const log = next => (...args) => {
  const result = next(...args)

  // will print from the last call to the first
  console.log('Args = ', args)
  console.log('Result = ', result)

  return result
}

const middlewares = [log]

const sum = recursive(self => ([head = 0, ...tail]) => {
  return tail.length === 0
    ? head
    : head + self(tail)
}, middlewares)

const value = sum([1, 2, 3])

// third call:
//  Args = [[3]]
//  Result = 3

// second call:
//  Args = [[2, 3]]
//  Result = 5

// first call:
//  Args = [[1, 2, 3]]
//  Result = 6

console.log(value) // => 6
```

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
