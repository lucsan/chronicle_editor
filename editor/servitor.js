const ckr = require('./checker.js')
const fs = require('fs')
const config = require('./config.js').config()

const updateProp = (cmds, responder, response) => {
  updatePropAttribute(cmds)
  const fileText = makePropsPlansFile()
  fs.writeFileSync(config.target.propsPlans, fileText)
  const params = JSON.stringify({ act: 'updatedProp', prop: cmds.prop, address: cmds.address })
  responder(response, params, 'text/html')

  //global.chronicle.save = `updated props ${cmds.prop} ${cmds.address}`
}

const deleteProp = (cmds, responder, response) => {  
  console.log(cmds)
  deletePropAttribute(cmds)
  const fileText = makePropsPlansFile()
  console.log(fileText)
  fs.writeFileSync(config.target.propsPlans, fileText)
  const params = JSON.stringify({ act: 'deletedProp', prop: cmds.prop, address: cmds.address })
  responder(response, params, 'text/html')
  // global.chronicle.save = `deleted prop ${cmds.prop}.${cmds.address}`
}

const newProp = (cmds, responder, response) => {
  if (global.chronicle.propsPlans[cmds.prop]) return responder(response, `issue: prop ${prop} already exists`, 'text/html')
  
  global.chronicle.propsPlans[cmds.prop] = {}
  const fileText = makePropsPlansFile()  
  fs.writeFileSync(config.target.propsPlans, fileText)
  const params = JSON.stringify({ act: 'addedProp', prop: cmds.prop })
  responder(response, params, 'text/html')
}

const deletePropAttribute = (cmds) => {
  const address = cmds.address
  const prop = cmds.prop
  let a = address.split('.')

  if (a.length == 1) delete(global.chronicle.propsPlans[prop][address])
  if (a.length == 2) delete(global.chronicle.propsPlans[prop][a[0]][a[1]])
  if (a.length == 3) delete(global.chronicle.propsPlans[prop][a[0]][a[1]][a[2]])
}

const updatePropAttribute = (cmds) => {
  const address = cmds.address
  const value = cmds.value
  const prop = cmds.prop

  let a = address.split('.')
console.log(cmds)

  if (a.length == 1) global.chronicle.propsPlans[prop][address] = value
  if (a.length == 2) global.chronicle.propsPlans[prop][a[0]][a[1]] = value
  if (a.length == 3) global.chronicle.propsPlans[prop][a[0]][a[1]][a[2]] = value

}

const delimitValue = (value) => {
  if (typeof value == 'string') return `'${value}'`
  if (Array.isArray(value)) return `['${value,join(`','`)}']`
}

const makePropsPlansFile = () => {
  let s = ''
  s += 'const propsPlans = {\n'
  s += walks(global.chronicle.propsPlans)
  s+= '}'
  return s
}

const walks = (object) => {

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
        if (typeof value == 'object') value = `['${value.join(`','`)}']`
        console.log(value)
        
        s += `  ${tabs}${k}: ${value},\n`
        lv--
      }      
    }
    return s
  }
  str = walk(object, '', '', 1)
  return str
}


const main = (cmds, responder, response) => {
  if (typeof responder == 'undefined') responder = (response, data, mimeType) => { console.log('No responder - data: ', data) }

  if (typeof propsPlans == 'undefined') { 
    ckr.readJsVar(config.source.propsPlans)
    global.chronicle = {}
    global.chronicle.propsPlans = propsPlans
  }
  //cmds = JSON.parse(cmds)
  if (cmds.act == 'updateProp') return updateProp(cmds, responder, response)
  if (cmds.act == 'deleteProp') return deleteProp(cmds, responder, response)
  if (cmds.act == 'newProp') return newProp(cmds, responder, response)

  console.log('cmds', cmds)  
}


exports.main = main

// main({ act: 'updateProp', prop: 'stick', address: 'actions.bosh', value: 'do boshings' })
// main({ act: 'updateProp', prop: 'stick', address: 'actions.inv.destroy', value: (des) => { return ' oooblejd' } })
// main({ act: 'deleteProp', prop: 'stick', address: 'pickUp', value: (des) => { return ' oooblejd' } })
// main({ act: 'deleteProp', prop: 'stick', address: 'actions.inv.destroy', value: 'who cares' })
// main({ act: 'newProp', prop: 'brick', address: '', value: '' })