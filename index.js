"use strict"

var slice = require('sliced')
module.exports = afterQueue

function afterQueue(fn, doAfter) {
  after.__proto__ = fn
  after.prototype = fn.prototype
  function after() {
    var result = fn.apply(this, arguments)
    doAfter.value = result
    doAfter.fn = fn
    doAfter.args = slice(arguments)
    doAfter.apply(this, doAfter.args)
    result = doAfter.value
    delete doAfter.value
    delete doAfter.args
    delete doAfter.fn
    return result
  }
  return after
}

afterQueue.return = function afterQueueValue(fn, doAfter) {
  after.__proto__ = fn
  after.prototype = fn.prototype
  function after() {
    var result = fn.apply(this, arguments)
    doAfter.value = result
    doAfter.fn = fn
    doAfter.args = slice(arguments)
    result = doAfter.call(this, doAfter.value, doAfter.args, doAfter.fn)
    delete doAfter.value
    delete doAfter.args
    delete doAfter.fn
    return result
  }
  return after
}

