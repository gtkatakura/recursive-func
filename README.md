# recursive-func

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Create recursive functions with `Y-Combinator` style.
```js
const sum = recursive(self => ([head = 0, ...tail]) => {
  return tail.length === 0
    ? head
    : head + self(tail)
})

sum([1, 2, 3]) // => 6
```

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
