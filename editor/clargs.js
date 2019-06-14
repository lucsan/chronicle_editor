'strict'

const args = process.argv.slice(2)

const task = args[0]
let cmds = {}

if (args.length == 3) {
  cmds[args[1]] = args[2]
}

if (args.length == 5) {
  cmds[args[1]] = args[2]
  cmds[args[3]] = args[4]
}

function prompt(question, callback) {
  var stdin = process.stdin,
    stdout = process.stdout

  stdin.resume()
  stdout.write(question)

  stdin.once('data', function (data) {
    callback(data.toString().trim())
  })
}

exports.task = task
exports.cmds = cmds
exports.prompt = prompt
