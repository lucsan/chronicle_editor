const cnf = require('./config.js')
const cls = require('./clargs.js')
const ckr = require('./checker.js')
const edt = require('./editor.js')


const check = () => {
  if (!cls.cmds['-file']) { promptsFile(check); return }
  process.exit()
  if (cls.cmds['-file']) { ckr.readJsVar(cls.cmds['-file']); return }
}

const promptsFile = (callback) => {
  cls.prompt('I need a file. ', (input) => {
    cls.cmds['-file'] = input
    callback()
  })
}

const promptsTask = (callback) => {
  cls.prompt('I need a task. ', (input) => {
    cls.task = input
    callback()
  })
}


const list = () => {
  const config = cnf.config()
  ckr.readJsVar(config.defaultProps)
  ckr.readJsVar(config.defaultSets)

  console.log('----- Props -----');
  for (i in propsPlans) {
    console.log(`${i} - ${propsPlans[i].desc}`)
  }

  console.log('----- sets -----');
  for (i in setsPlans) {
    console.log(`${i} - ${setsPlans[i].desc}`)
  }



  if (cls.cmds['-item']) {
    const item = cls.cmds['-item']
    if (propsPlans[item]) {
      console.log(propsPlans[item]);
    }
    if (setsPlans[item]) {
      console.log(setsPlans[item]);
    }
  }

  //console.log(propsPlans.gnome.actions.env.speak());
  //console.log(propsPlans.lint.actions.bod.examine.toString());


}

const build = () => {

}

const hasATask = () => {
  if (!cls.task) { return promptsTask(hasATask) }

  if (cls.task == 'check') { return check() }
  if ( cls.task == 'list') { return list() }
  if ( cls.task == 'build') { return build() }

  console.log(`I did not recognise task '${cls.task}'`)
  process.exit()
}




// prompt('Whats your name?', function (input) {
//   console.log(input)
//   process.exit()
// })



hasATask()
