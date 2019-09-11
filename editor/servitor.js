exports.main = (cmds, responder) => {
  const ckr = require('./checker.js')
  const fs = require('fs')
  const config = require('./config.js').config()
  const configPath = 'editor/config.js'

  const updateProp = (cmds, responder) => {
    
    const udSel = updatePropSelector(cmds)
    if (udSel.error) return responder(JSON.stringify(udSel.error), 'text/html')
    
    if (!cmds.test) {
      const fileText = makePropsPlansFile()
      // fs.writeFileSync(target, fileText)      
      fs.writeFileSync(config.plans.props.temp, fileText)      
    }

    // const params = JSON.stringify({ act: 'updatedProp', prop: cmds.prop, address: cmds.address })
    //console.log('udSel', udSel)
   console.log('udsel', udSel)
    
    const params = JSON.stringify(udSel)

    responder(params, 'text/html')

    //global.chronicle.save = `updated props ${cmds.prop} ${cmds.address}`
  }


  const updateItem = (cmds, responder) => {
    const udSel = updateSelector(cmds)
    if (udSel.error) return responder(JSON.stringify(udSel.error), 'text/html')

    if (!cmds.test) { makePlansFile(cmds.is) }

    console.log('udsel', udSel)

    responder(JSON.stringify(udSel), 'text/html')
  }

  const makePlansFile = (isType) => {
    if (isType == 'prop') {
      return fs.writeFileSync(config.plans.props.temp, makePropsPlansFile(global.plans.props, 'let'))
    }
    if (isType == 'set') {
      return fs.writeFileSync(config.plans.sets.temp, makeSetsPlansFile(global.plans.sets, 'let'))
    }
  }


  const updateSelector = (cmds) => {
    console.log('us', cmds)
    const { act, prop, set, address, value } = cmds
    
    let plans = {}
    let item = null

    if (cmds.prop) {
      cmds.is = 'prop'
      plans = global.plans.props
      item = prop
    }

    if (cmds.set) {
      cmds.is = 'set'
      plans = global.plans.sets
      item = set
    }

    if (act == 'add' && item == 'new') return newItem(plans, address, cmds.is)
    if (act == 'add' && item && address) return newAttribute(plans, item, address, cmds.is )


    return { error: 'dev upSel' }
    
  }

  const newItem = (plans, name, isType) => {
    if (plans[name]) return { act: `new${isType}`, error: `${isType} ${name} exists.`}
    plans[name] = {}
    return { act: 'added', [`${isType}`]: name } 
  }

  const newAttribute = (plans, item, address, isType) => {
    if (plans[item][address]) return { act: `new${isType}Attribute`, error: `${isType} ${address} exists.` }
    plans[item][address] = null
    return { act: `addedAttribute`, [`${isType}`]: item, address }
  }

  
  const newPropAttribute = (prop, value) => {
    if (global.plans.props[prop][value]) return { act: 'newPropAttribute', error: `prop ${prop} attrib ${value} exists.` }
    global.plans.props[prop][value] = null
    return { act: 'addedPropAttribute', prop: prop, address: value }    
  }

  // const newProp = (prop) => {
  //   if (global.plans.props[prop]) return { act: 'newProp', error: `prop ${prop} exists.` }
  //   global.plans.props[prop] = {}
  //   return { act: 'addedProp', prop: prop }
  // }

  const updatePropSelector = (cmds) => {
    const {
      act,
      prop,
      oldProp,
      address,
      value
    } = cmds

    if (act == 'deleteProp') { return deleteProp(prop) }
    if (act == 'deletePropAttribute') { return deletePropAttribute(prop, address) }

    if (!cmds.value && cmds.value != 'new') return { act: cmds.act, error: `no value given` }

    if (!prop && !address) { return newProp(value) }
    if (prop && !address)  { return newPropAttribute(prop, value) }
    if (prop && address)   { return updatePropAttribute(prop, address, value) }

    
    console.log('cmds', cmds)
    
    return { error: 'dev upSel' }
    
  }




  const deleteProp = (prop) => {
    delete(global.plans.props[prop])
    return { error: 'dev delPro', act: 'deleteProp' }
  }

  const deletePropAttribute = (prop, address) => {
    console.log('delete Prop Attribute')
    addressDestructor(global.plans.props[prop], address)
    return { act: 'deletedPropAttribute', prop: prop, address: address }    
  }

  const updatePropAttribute = (prop, address, value) => {
    addressAddressor(global.plans.props[prop], address, value)
    return { act: 'updatedPropAttribute', prop: prop, address: address, value: value }
  }

  const addressDestructor = (plans, address) => {
    const [prime, genus, order] = address.split('.')
    if (order) return delete(plans[prime][genus][order])
    if (genus) return delete(plans[prime][genus])
    if (prime) return delete(plans[prime])
  }

  /* Rules:
   * An address can be upto 3 items (a.b.c)
   * Plans are prop or set pointer
   * if a place (prime, genus, order) exists value is added
   * if a place does not exist, will make one
   * returns nothing as it mutates the plans object
  */
  const addressAddressor = (plans, address, value) => {
    const [prime, genus, order] = address.split('.')
    let v = null
    typeof value == 'object' && !Array.isArray(value)? v = {...value}: v = value 
    if (prime && !plans[prime]) { plans[prime] = {} }
    if (genus && !plans[prime][genus]) { plans[prime][genus] = {} }
    if (order) return plans[prime][genus][order] = v
    if (genus) return plans[prime][genus] = v
    if (prime) return plans[prime] = v
  }

  const makePropsPlansFile = (plans, varType = 'const') => {
    let s = ''
    s += `${varType} propsPlans = {\n`
    s += plansToStringWalker(plans)
    s+= '}'
    return s
  }

  const makeSetsPlansFile = (plans, varType = 'const') => {
    let s = ''
    s +=  `${varType} setsPlans = {\n`
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
            s += `${tabs}${key}: [${plans[key]}],\n`
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

  //console.log('plans', global.plans)

  //TODO: refactor these down to all use act == prop
  // if (cmds.act == 'prop') return updateProp(cmds, responder) 
 
  //if (cmds.act == 'newProp') return updateProp(cmds, responder)
  // if (cmds.act == 'updateProp') return updateProp(cmds, responder)
  // if (cmds.act == 'deleteProp') return updateProp(cmds, responder)       
  // if (cmds.act == 'newPropAttribute') return updateProp(cmds, responder)    
  // if (cmds.act == 'deletePropAttribute') return updateProp(cmds, responder)

  console.log('cmds', cmds)

  if (cmds.prop || cmds.set) { return updateItem(cmds, responder) }

  if (cmds.act == 'createBrowserConfig') return createBrowserConfig()
  if (cmds.act == 'createEditPlans') return createEditPlans() 


  console.log('Unknown act: cmds ', cmds)    

  return {
    setup,
    plansToStringWalker
  }
}



