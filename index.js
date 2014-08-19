"use strict"

var slice = require('sliced')
module.exports = afterQueue

function afterQueue(fn, doAfter) {
  after.__proto__ = fn
  after.prototype = fn.prototype
  function after() {
    var result = fn.apply(this, arguments)

    var valueBefore = doAfter.value
    var fnBefore = doAfter.fn
    var argsBefore = doAfter.args

    doAfter.value = result
    doAfter.fn = fn
    doAfter.args = slice(arguments)
    doAfter.apply(this, doAfter.args)
    result = doAfter.value
    doAfter.value = valueBefore
    doAfter.args = argsBefore
    doAfter.fn = fnBefore
    return result
  }
  return after
}

afterQueue.return = function afterQueueValue(fn, doAfter) {
  after.__proto__ = fn
  after.prototype = fn.prototype
  function after() {

    var valueBefore = doAfter.value
    var fnBefore = doAfter.fn
    var argsBefore = doAfter.args

    var result = fn.apply(this, arguments)

    doAfter.value = result
    doAfter.fn = fn
    doAfter.args = slice(arguments)

    result = doAfter.call(this, doAfter.value, doAfter.args, doAfter.fn)

    doAfter.value = valueBefore
    doAfter.args = argsBefore
    doAfter.fn = fnBefore
    return result
  }
  return after
}

