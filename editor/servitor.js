exports.main = (cmds, responder) => {
  const ckr = require('./checker.js')
  const fs = require('fs')
  const config = require('./config.js').config()
  const configPath = 'editor/config.js'

  const updateItem = (cmds, responder) => {
    const udSel = updateSelector(cmds)
    if (udSel.error) return responder(JSON.stringify(udSel.error), 'text/html')

    if (!cmds.test) { makePlansFile(cmds.itemType) }

    console.log('udsel', udSel)

    responder(JSON.stringify(udSel), 'text/html')
  }

  const updateSelector = (cmds) => {
    const { act, prop, set, address, value } = cmds
    
    let plans = {}
    let item = null
    let itemType = null

    if (cmds.prop) {
      itemType = 'prop'
      plans = global.plans.props
      item = prop
    }

    if (cmds.set) {
      itemType = 'set'
      plans = global.plans.sets
      item = set
    }

    cmds.itemType = itemType

    if (act == 'add' && item == 'new') return newItem(plans, address, itemType)
    if (act == 'add' && item && address) return updateAttribute(plans, item, address, {}, itemType)

    if (act == 'update' && item && address && value) return updateAttribute(plans, item, address, value, itemType)  

    if (act == 'delete' && item && !address) return deleteItem(plans, item, itemType)    
    if (act == 'delete' && item && address) return deleteAttribute(plans, item, address, itemType)
 
    return { error: 'dev upSel', data: cmds }
    
  }

  const makePlansFile = (isType) => {
    console.log('making plans files', isType)
    
    if (isType == 'prop') {
      return fs.writeFileSync(config.plans.props.temp, makePlansFileString(global.plans.props, 'propsPlans', 'let'))
    }
    if (isType == 'set') {
      return fs.writeFileSync(config.plans.sets.temp, makePlansFileString(global.plans.sets, 'setsPlans', 'let'))
    }
  }

  const newItem = (plans, name, isType) => {
    if (plans[name]) return { act: `new${isType}`, error: `${isType} ${name} exists.`}
    plans[name] = {}
    return { act: 'added', [isType]: name } 
  }

   const deleteItem = (plans, item, isType) => {
    delete(plans[item])
    return { act: 'deletedItem', [isType]: item }
  } 

  const updateAttribute = (plans, item, address, value, isType) => {
    addressAddressor(address, plans[item], value)
    return { act: 'updatedAttribute', [isType]: item, address, value }
  }

  const deleteAttribute = (plans, item, address, isType) => {
    addressDestructor(plans[item], address)
    return { act: 'deletedAttribute', [isType]: item, address }
  }

  const addressDestructor = (plans, address) => {
    const [one, two, thr, fou, fiv] = address.split('.')
    if (fiv) return delete(plans[one][two][thr][fou][fiv])
    if (fou) return delete(plans[one][two][thr][fou])
    if (thr) return delete(plans[one][two][thr])
    if (two) return delete(plans[one][two])
    if (one) return delete(plans[one])
  }

  const addressAddressor = (address, plans, value) => {
    const [one, two, thr, fou, fiv] = address.split('.')
    let v = null
    typeof value == 'object' && !Array.isArray(value)? v = {...value}: v = value 

    if (one && !plans[one]) plans[one] = {}
    if (two && !plans[one][two]) plans[one][two] = {}
    if (thr && !plans[one][two][thr]) plans[one][two][thr] = {}
    if (fou && !plans[one][two][thr][fou]) plans[one][two][thr][fou] = {}
    if (fiv && !plans[one][two][thr][fou][fiv]) plans[one][two][thr][fou][fiv] = {}

    if (fiv) return plans[one][two][thr][fou][fiv] = v
    if (fou) return plans[one][two][thr][fou] = v
    if (thr) return plans[one][two][thr] = v
    if (two) return plans[one][two] = v
    if (one) return plans[one] = v
  }

  const makePlansFileString = (plans, varName = 'propsPlans', varType = 'const') => {
    let s = ''
    s += `${varType} ${varName} = {\n`
    s += plansToStringWalker(plans)
    s+= '}'
    return s    
  }

  const plansToStringWalker = (plans, i = 0) => {
    i++
    let tabs = ''
    for (let c = 0; c < i; c++) {  
      tabs += '\t'
    }
    if (typeof plans == 'object') { // Any object (ie: also arrays)
      let s = ''  
      for (let key in plans) {
        if (!Array.isArray(plans[key])) { // not array object
          const { ks, omo, omc } = demarcPairing(plans[key], key, tabs)
          const pwr = plansToStringWalker(plans[key], i)
          s += `${tabs}${ks}${omo}${pwr}${omc}`
        } else { // is an array
          if (typeof plans[key][0] == 'object') { // array contains objects (and/or arrays)
            s += `${tabs}${key}: [\n`
            for (let int in plans[key]) {
              s += `${tabs}{\n${plansToStringWalker(plans[key][int], i)}${tabs}},\n`
            }
            s+= `${tabs}],\n`
          } else { // array is a list
            s += `${tabs}${key}: [${plans[key].map(k => `'${k}'`)}],\n`
          }
        }    
      }
      return s
    } else {
      return plans
    }
  }

  const demarcPairing = (item, key, tabs) => {
    let ks = `${key}: `
    let omo = '{\n'
    let omc = `${tabs}},\n`
    let toi = typeof item
    if (Array.isArray(item)) {
      omo = '['
      omc = '],\n'
    }
    if (toi == 'string') {
      omo = '\''
      omc = '\',\n'
    }
    if (toi == 'number' || toi == 'boolean' || toi == 'function') {
      omo = ''
      omc = ',\n'
    }

    return { ks, omo, omc }
  }
  
  const createEditPlans = () => {
    console.log('creating edit plans')
    
    const pp = fs.readFileSync(config.plans.props.source, 'utf-8')
    fs.writeFileSync(config.plans.props.temp, pp.replace('const ', 'let '))

    const sp = fs.readFileSync(config.plans.sets.source, 'utf-8')
    fs.writeFileSync(config.plans.sets.temp, sp.replace('const ', 'let '))
  }

  const createBrowserConfig = () => {
    const cf = fs.readFileSync(configPath, 'utf-8')
    const bcf = cf.replace('exports.config = config', '')
    fs.writeFileSync(`${config.root}/${config.public}/config.js`, bcf)
  }

  const harden = () => {
    const pp = fs.readFileSync(config.plans.props.temp, 'utf-8')
    fs.writeFileSync(config.plans.props.source, pp.replace('let ', 'const '))
  }
  
  const setup = () => {
    createBrowserConfig()

    if (global.plans == undefined) {
      createEditPlans()
      global.plans = {}
    }

    if (global.plans.props == undefined) {
      ckr.readJsVar(config.plans.props.temp)
      global.plans.props = propsPlans
    }

    if (global.plans.sets == undefined) {
      ckr.readJsVar(config.plans.sets.temp)
      global.plans.sets = setsPlans
    }

  }

  console.log('cmds', cmds)

  if (cmds.act == 'harden') return harden(responder)

  if (cmds.prop || cmds.set) { return updateItem(cmds, responder) }

  if (cmds.act == 'createBrowserConfig') return createBrowserConfig()
  if (cmds.act == 'createEditPlans') return createEditPlans() 


  console.log('Unknown act: cmds ', cmds)    

  return {
    setup,
    updateSelector,
    plansToStringWalker,
    addressAddressor,
    addressDestructor
  }
}
