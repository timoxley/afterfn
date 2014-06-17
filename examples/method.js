var after = require('../')

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

