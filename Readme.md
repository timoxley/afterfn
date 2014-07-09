# afterfn

#### Execute a function after given function.

`afterfn` Simply executes after the function is called.
`afterfn.return` Allows manipulation of return value.

## Examples

```js
function doubleNumber(x) {
  return x * 2
}

// calls 'Math.abs' after 'doubleNumber'
// after.return allows manipulation of return value
var doubleNumberAbs = after.return(doubleNumber, Math.abs)

var calledWith = []
var results = []

doubleNumberAbs = after(doubleNumberAbs, function fn() {
  calledWith = calledWith.concat(fn.args)
  results = results.concat(fn.value)
  // after ignores return value of after function.
})

console.log(doubleNumberAbs(10)) // => 20
console.log(doubleNumberAbs(-10)) // => 20
console.log(doubleNumberAbs(-100)) // => 200

console.log(calledWith) // => [ 10, -10, -100 ]
console.log(results) // => [ 20, 20, 200 ]
```

```js
var myPackage = {
  name: 'my-package',
  version: 1,
  build: function() {
    // build routine
  },
  bumpVersion: function() {
    this.version++
  }
}

// always calls 'myPackage.build' *after* 'myPackage.bumpVersion'
myPackage.build = after(myPackage.build, myPackage.bumpVersion)

console.log('%s@v%s', myPackage.name, myPackage.version) // => my-package@v1
myPackage.build()
console.log('%s@v%s', myPackage.name, myPackage.version) // => my-package@v2

```

## Facts

* `afterfn` returns a new Function.
* `afterfn` ignores return value of after function
* `afterfn.return` allows manipulation of return value
* Original return value will be passed as the first argument to the after function.
* Original arguments will be passed as the second argument to the after function.
* Original function will be passed as the third argument to the after function.
* Original function `this` context is maintained.
* Properties and prototype are inherited though function arity will not be preserved.

## See Also

* [timoxley/beforefn](http://github.com/timoxley/beforefn)
* [timoxley/guardfn](http://github.com/timoxley/guardfn)

## License

MIT
