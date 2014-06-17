"use strict"
var slice = require('sliced')
module.exports = afterQueue

function afterQueue(fn, doAfter) {
  function after() {
    var result = fn.apply(this, arguments)
    function f() {
      return fn.apply(this, arguments)
    }
    doAfter.call(this, result, slice(arguments), fn)
    return result
  }
  return after
}

afterQueue.return = function afterQueueValue(fn, doAfter) {
  function after() {
    var result = fn.apply(this, arguments)
    function f() {
      return fn.apply(this, arguments)
    }
    return doAfter.call(this, result, slice(arguments), fn)
  }
  return after
}
