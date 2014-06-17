var after = require('../')

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
