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

test('after is passed args as regular args', function(t) {
  t.plan(1)
  after(function(a, b, c) {
    return
  }, function() {
    t.deepEqual([].slice.call(arguments), [1,2,3])
  })(1,2,3)
})

test('after is passed args on fn', function(t) {
  t.plan(1)
  after(function(a, b, c) {
    return
  }, function fn() {
    t.deepEqual(fn.args, [1,2,3])
  })(1,2,3)
})

test('after.return is passed args on fn', function(t) {
  t.plan(1)
  after.return(function(a, b, c) {
    return
  }, function fn() {
    t.deepEqual(fn.args, [1,2,3])
  })(1,2,3)
})


test('after is passed original fn on fn', function(t) {
  t.plan(1)
  var noop = function(a, b, c) {
    return
  }
  after(noop, function fn() {
    t.equal(fn.fn, noop)
  })()
})

test('after is passed return value on fn', function(t) {
  t.plan(1)
  after(function(a, b, c) {
    return 10
  }, function fn() {
    t.equal(fn.value, 10)
  })()
})

test('after.return is passed return value on fn', function(t) {
  t.plan(1)
  after.return(function(a, b, c) {
    return 10
  }, function fn() {
    t.equal(fn.value, 10)
  })()
})

test('after cannot change return value with return', function(t) {
  var fn = after(function(a, b, c) {
    return a + b + c
  }, function() {
    return 200
  })
  t.equal(fn(1,2,3), 6)
  t.end()
})

test('after can change return value by changing fn.value', function(t) {
  var fn = after(function(a, b, c) {
    return a + b + c
  }, function fn(a, b, c) {
    fn.value = fn.value * 1000
    return 200
  })
  t.equal(fn(1,2,3), 6000)
  t.end()
})

test('after.return can change return value with return', function(t) {
  var fn = after.return(function(a, b, c) {
    return a + b + c
  }, function(result) {
    return result * 2
  })
  t.equal(fn(1,2,3), 12)
  t.end()
})

test('after.return cannot change return value with fn.value', function(t) {
  var fn = after.return(function(a, b, c) {
    return a + b + c
  }, function fn(result) {
    fn.value = 1000
    return result * 2
  })
  t.equal(fn(1,2,3), 12)
  t.end()
})

test('after.return is passed original function', function(t) {
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
test('after.return is passed original function on fn', function(t) {
  var noop = function(a, b) {
    return
  }
  var fn = after.return(noop, function fn() {
    return fn.fn
  })
  t.equal(fn(), noop)
  t.end()
})

test('after.return overrides return value', function(t) {
  var result = after.return(function(a, b) {
    return a + b
  }, function() {
    return 100
  })
  t.equal(result(2,3), 100)
  t.end()
})

test('function keys are propagated with copy on write', function(t) {
  function stuff(arg) {
    return stuff.amount + arg
  }
  stuff.amount = 10

  var newStuff = after.return(stuff, function(result) {
    return result + 1
  })

  t.equal(newStuff.prototype, stuff.prototype)
  t.equal(newStuff.amount, 10)
  stuff.amount = 12
  t.equal(newStuff.amount, 12)
  newStuff.amount = 100
  t.equal(stuff.amount, 12)
  t.equal(newStuff.amount, 100)
  stuff.amount = 120
  t.equal(stuff.amount, 120)
  t.equal(newStuff.amount, 100)
  t.end()
})

test('chain executes in order of definition', function(t) {
  t.plan(3)
  var called = []

  function add(a, b) {
    return a + b
  }

  var fn = after(add, function() {
    t.deepEqual(called, [])
    called.push('first')
  })

  fn = after.return(fn, function(result) {
    t.deepEqual(called, ['first'])
    called.push('second')
    return result
  })

  t.equal(fn(2,3), 5)
})

test('function keys are copied across', function(t) {
  function Thing() {}
  Thing.copied = true
  var anotherThing = {}
  Thing.prototype = anotherThing

  var NewThing = after(Thing, function() {})
  t.ok(NewThing.copied)
  t.equal(NewThing.prototype, anotherThing)
  t.end()
})

test('function keys are available on fn.fn', function(t) {
  function Thing() {}
  Thing.copied = true
  var anotherThing = {}
  Thing.prototype = anotherThing

  after(Thing, function fn() {
    t.ok(fn.fn.copied)
    t.equal(fn.fn.prototype, anotherThing)
    t.end()
  })()
})

test('recursive calls work correctly', function(t) {
  t.plan(8)
  var count = 0
  var addOne = after.return(function(arg) {
    return arg
  }, function fn(arg) {
    ;(function(count) {
      t.deepEqual(fn.args, [count - 1], 'fn.args == [ '+(count - 1)+' ] ')
      fn.args = null
      if (count < 4) {
        var actual = addOne(count)
        t.equal(actual, count + 1, 'addOne('+count+') '+actual+' == ' + (count + 1))
      }
    })(++count)
    return arg+1
  })
  t.equal(addOne(count), 1)
})

test('no error if args set to weird value', function(t) {
  var args = [1,2,3]
  var target = function(a, b, c) {
    t.equal(arguments.length, 3)
    t.deepEqual([].slice.call(arguments), args)
    return a + b + c
  }

  var a = after(target, function fn() {
    t.deepEqual(fn.args, args)
    fn.args = {}
  })

  var b = after(a, function fn() {
    t.deepEqual(fn.args, args)
    fn.args = null
  })

  var c = after(b, function fn() {
    t.deepEqual(fn.args, args)
    fn.args = false
  })

  t.equal(c.apply(null, args), 6)
  t.end()
})
