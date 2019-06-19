var fs = require('fs')
var vm = require('vm')

const readJsVar = (filePath) => {
  const script = new vm.Script(fs.readFileSync(filePath))
  script.runInThisContext()
}

exports.readJsVar = readJsVar
