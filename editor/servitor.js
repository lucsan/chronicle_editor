exports.main = (cmds, responder) => {
  const ckr = require('./checker.js')
  const fs = require('fs')
  const config = require('./config.js').config()

  const updateProp = (cmds, responder) => {
    
    const udSel = updateSelector(cmds)
    if (udSel.error) return responder(JSON.stringify(udSel.error), 'text/html')
    
    if (!cmds.test) {
      const fileText = makePropsPlansFile()
      fs.writeFileSync(config.plans.props.target, fileText)      
    }

    // const params = JSON.stringify({ act: 'updatedProp', prop: cmds.prop, address: cmds.address })
    //console.log('udSel', udSel)
   console.log('udsel', udSel)
    
    const params = JSON.stringify(udSel)

    responder(params, 'text/html')

    //global.chronicle.save = `updated props ${cmds.prop} ${cmds.address}`
  }
  
  // new Prop if prop dosen't exist, [done]
  // change prop name (update) [issue]
  // new attribute (new prop if prop dosen't exist)
  // change attribute (update)

  // no value (error)
  // v !address !prop = new prop
  // v prop !address = update prop (name)
  //   -- cant handle this, needs oldPropName, or newPropName
  //   -- maybe copy prop?
  // v prop address = new or update attribute

  const updateSelector = (cmds) => {
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

  const newProp = (prop) => {
    if (global.plans.props[prop]) return { act: 'newProp', error: `prop ${prop} exists.` }
    global.plans.props[prop] = {}
    return { act: 'addedProp', prop: prop }
  }

  const newPropAttribute = (prop, value) => {
    if (global.plans.props[prop][value]) return { act: 'newPropAttribute', error: `prop ${prop} attrib ${value} exists.` }
    global.plans.props[prop][value] = null
    return { act: 'addedPropAttribute', prop: prop, address: value }    
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

  const makePropsPlansFile = () => {
    let s = ''
    s += 'const propsPlans = {\n'
    s += plansWalker(global.plans.props)
    s+= '}'
    return s
  }
  
  const plansWalker = (plans) => {
  
    const walk = (obj, s, tabs, lv) => {
      for (let k in obj) {
        lv++
        if (typeof obj[k] == 'object' && !Array.isArray(obj[k])) {
          tabs += '  '       
          s += `${tabs}${k}: {\n`
          s = walk(obj[k], s, tabs, lv)
          s += `${tabs}},\n`
          tabs = tabs.substring(0, tabs.length - 2)
          lv--
          if (lv === 1) s += '\n'               
        } else {
          let value = obj[k]
          //if (value === 'null') console.log(k)
          if (typeof value == 'string') value =  `'${value}'`
          if (typeof value == 'object') value = `['${value.join('\',\'')}']`
          //console.log(value)
          
          s += `  ${tabs}${k}: ${value},\n`
          lv--
        }      
      }
      return s
    }
    return walk(plans, '', '', 1)
  }
  

  const setup = () => {
  //if (typeof responder == 'undefined') responder = (response, cmds, mimeType) => { console.log('No responder - data: ', cmds) }

    if (typeof global.plans == 'undefined' || typeof global.plans.props == 'undefined') { 
      ckr.readJsVar(config.plans.props.source)
      global.plans = {}
      global.plans.props = propsPlans
    }

    // console.log('source', config.plans.props.source)
    // console.log('target', config.propsPlans.use.target)

    if (cmds.act == 'newProp') return updateProp(cmds, responder) 
    if (cmds.act == 'updateProp') return updateProp(cmds, responder)
    if (cmds.act == 'deleteProp') return updateProp(cmds, responder)       
    if (cmds.act == 'newPropAttribute') return updateProp(cmds, responder)    
    if (cmds.act == 'deletePropAttribute') return updateProp(cmds, responder)    


    console.log('Unknown act: cmds ', cmds)  
    
  }


  setup()

}