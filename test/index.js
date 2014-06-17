"use strict"

var test = require('tape')
var after = require('../')

test('after executes after', function(t) {
  t.plan(2)
  var called = []
  after(function() {
    t.deepEqual(called, [])
    called.push('first')
  }, function() {
    t.deepEqual(called, ['first'])
    called.push('second')
  })()
})

test('after maintains context', function(t) {
  t.plan(2)
  var context = {called: 0}
  after(function() {
    this.called++
  }, function() {
    t.equal(this.called, 1)
    t.equal(this, context)
  }).apply(context)
})

test('after is passed args', function(t) {
  t.plan(1)
  after(function(a, b, c) {
    return
  }, function(result, args) {
    t.deepEqual(args, [1,2,3])
  })(1,2,3)
})

test('after cannot change return value', function(t) {
  var fn = after(function(a, b, c) {
    return a + b + c
  }, function(result) {
    return result * 2
  })
  t.equal(fn(1,2,3), 6)
  t.end()
})

test('after.return can change return value', function(t) {
  var fn = after.return(function(a, b, c) {
    return a + b + c
  }, function(result) {
    return result * 2
  })
  t.equal(fn(1,2,3), 12)
  t.end()
})

test('after is passed original function', function(t) {
  var fn = after.return(function(a, b) {
    return a + b
  }, function(result, args, fn) {
    return result + fn.apply(this, args.map(function(x) {
      return x * 2
    }))
  })
  t.equal(fn(1,2), 9)
  t.end()
})

test('returns value', function(t) {
  var result = after.return(function(a, b) {
    return a + b
  }, function() {
    return 100
  })
  t.equal(result(2,3), 100)
  t.end()
})

test('chain executes in order of definition', function(t) {
  t.plan(3)
  var called = []
  var result = after.return(function(a, b) {
    return a + b
  }, function(result) {
    t.deepEqual(called, [])
    called.push('first')
    return result
  })

  result = after.return(result, function(result) {
    t.deepEqual(called, ['first'])
    called.push('second')
    return result
  })

  t.equal(result(2,3), 5)
})
