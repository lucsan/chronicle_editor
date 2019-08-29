'strict'

window.chronicle = {}
window.chronicle.plans = {}
window.chronicle.plans.props = propsPlans
window.chronicle.plans.propsUpdate = propsPlans

window.onload = () => edit()

const edit = (prop) => {
  prop = displayCurrentProp(prop)

  let output = document.getElementById('output')
  output.innerHTML = ''

  output.appendChild(listsLocations())
  output.appendChild(listsProps())

  if (typeof window.chronicle.prop == 'undefined') return

  output.appendChild(propOutput(prop))
  output.appendChild(addNewAttribute())

  const plans = window.chronicle.plans.props[prop]    
  const attribElems = elementsFromObjects(plans, elCom('div'))

  let mds = missingDefaults(window.chronicle.plans.props[prop])
  const defaults = elementsFromObjects(mds, elCom('div', { id: 'missingDefaults', classes: 'missingDefaults' } ))    

  output.appendChild(attribElems)
  output.appendChild(defaults)
}

const propOutput = (prop) => {
  let w = elCom('div', { id: 'prop' })
  w.appendChild(elCom('div', { text: prop, classes: 'title'}))
  w.appendChild(
    elCom('div', { id: 'propAttributes', classes: 'propsEdit' })
  )
  return w
}

const displayCurrentProp = (prop) => {
  if (prop != null) { 
    localStorage.setItem('chronicleProp', prop)
  } else {
    prop = localStorage.getItem('chronicleProp')
  }
  window.chronicle.prop = prop
  return prop
}

const listsLocations = () => {
  let ul = elCom('ul', { id: 'setsList', classes: 'setsList' })
  for (let s in setsPlans) {
    ul.appendChild(elCom('li', { 
      text: s,
      'func': () => { console.log(s) } 
    }))
  }
  return ul
}

const listsProps = () => {
  let c = elCom('div', { id: 'thingsList' })
  c.appendChild(addNewProp())

  for (const p in window.chronicle.plans.props) {
    let el = elCom('div', { id: p })
    el.innerText = p
    el.className = `button ${p}`
    elAel(el, () => { edit(p) })
    c.appendChild(el)
  }
  return c
}

const addNewProp = () => {
  let e = elCom('div', { id: 'newProp' })
  e.innerText = 'New Prop'
  e.className = 'button'
  elAel(e, () => { edit('new') })
  return e
}

const addNewAttribute = () => {
  const id = 'newPropAttribute'
  let na = elCom('div', {})
  let t= elCom('textarea', { id: id, classes: 'textareaShort' })
  let b = renderButton('add', 'add', () => { updateProp({ act: 'add', valueElId: id }) })

  na.appendChild(elCom('span', { text: 'New Attrib' } ))
  na.appendChild(t)
  na.appendChild(b)

  return na
}

const missingDefaults = (targetProp) => {
  let missing = []
  const dp = defaultProp()
  if (targetProp == undefined) return dp  
  for (let i in dp) {
    if (!targetProp[i]) {
      missing[i] = dp[i]
    }
  }
  return missing
}

const elementsFromObjects = (object, el) => {

  const walk = (obj, ind, pa) => {
    let indClass = indentClass(ind)
    for (let k in obj) {
      if (typeof(obj[k]) == 'object' && !Array.isArray(obj[k])) {
        el.appendChild(nameLevelElement(k, pa, indClass))
        walk(obj[k], ++ind, pa += `${k}.`)
        --ind
        pa = pa.replace(`${k}.`, '')
      } else {
        el.appendChild(valueLevelElement(obj, k, pa, indClass))
        
      }
    }
  }
  walk(object, 0, '')

  return el
}

const indentClass = (ind) => {
  if (ind > 0) return `indent_${ind}`
  return ''
}

const nameLevelElement = (name, address, indClass) => {
  let e = elCom('div', { classes: `attrib ${indClass}`})
  const id = `${address}${name}`
  e.appendChild(elCom('span', { text: name, classes: `title ${indClass}` }))
  e.appendChild(elCom('textarea', { id: id, classes: 'textareaShort' }))
  e.appendChild(renderObjectButtons({name: name, address: address, valueElId: id }))
  return e
}

const valueLevelElement = (obj, name, address, indClass) => {
  let e = elCom('div', { classes: `attrb ${indClass}` })
  const id = `${address}${name}`
  e.appendChild(elCom('span', { text: '*' + name, classes: 'title' }))
  e.appendChild(elCom('textarea', { id: id, classes: 'textareaLong', value: obj[name] }))
  e.appendChild(renderValueButtons({name, address, valueElId: id }))
  return e
}

const renderObjectButtons = (cmds) => {
  const address = `${cmds.address}${cmds.name}`
  let btns = elCom('span', { classes: 'buttons' })

  const addressItems = address.split('.')
  if (addressItems.length < 3) {
    btns.appendChild(renderButton('add', 'add', () => { prepAndPostPropValues({ ...cmds, act: 'add' }) }))  
  }

  btns.appendChild(renderButton('update', 'update', () => { prepAndPostPropValues(cmds) }))  

  btns.appendChild(renderButton('delete', 'delete', () => {
    deletePropAttribute({ ...cmds, address: address }) 
  }))


  return btns
}

const renderValueButtons = (cmds) => {
  const address = `${cmds.address}${cmds.name}`
  let btns = elCom('span')
  btns.appendChild(renderButton('update', 'update', () => { prepAndPostPropValues(cmds) }))

  btns.appendChild(renderButton('delete', 'delete', () => {
    deletePropAttribute({ ...cmds, address: address, value: document.getElementById(cmds.valueElId).value })
  }))
  return btns
}

const prepAndPostPropValues = (cmds, action) => {
  // console.log('recievedValues', {...cmds}, action)

  let { name, address, valueElId, act } = cmds
  let value = document.getElementById(valueElId).value 

  const obj = makeAddress({ address, name, value, act })
  if (action) { 
    obj.act = action
  } else {
    obj.act = 'updateProp'
  }
  obj.prop = window.chronicle.prop  

  console.log('obj', obj)  

  addressAddressor(window.chronicle.plans.propsUpdate[obj.prop], obj.address, obj.value)
 
  ajax(JSON.stringify(obj))
  // return obj
}

const makeAddress = (data) => {
  let obj = {}
  if (data.address == null || data.address == '') {
    if (data.name == null || data.name == '') {
      obj.address = data.value
      obj.value = {}
      return obj
    }

    if (data.act == 'add') {
      obj.address = `${data.name}.${data.value}`
      obj.value = {}
    } else {
      obj.address = data.name
      obj.value = data.value
    }

    return obj
  }

  obj.address = `${data.address}${data.name}`
  if (data.act == 'add') {
    obj.address += `.${data.value}`
    obj.value = {}
    return obj
  }
  obj.value = data.value
  return obj
}



// const updateProp = (cmds) => {
//   cmds = prepAndPostPropValues(cmds, 'updateProp')
//   // cmds.prop = window.chronicle.prop
//   // addressAddressor(window.chronicle.plans.propsUpdate[cmds.prop], cmds.address, cmds.value)
//   // ajax(JSON.stringify(cmds))
//   console.log('updateProp', cmds)
// }

// const updatePropValue = (cmds) => {
//   cmds = prepAndPostPropValues(cmds,'updateProp')
//   // cmds.act = 'updateProp'
//   // cmds.address = `${cmds.address}${cmds.name}`
//   //updateProp(cmds)

//   //ajax(JSON.stringify(cmds))
//   console.log('updatePropValue', cmds)
  
// }


// const addPropAttribute = (cmds) => {
//   cmds = prepAndPostPropValues(cmds,'updateProp')
//   // cmds.prop = window.chronicle.prop
//   // cmds.address = `${cmds.address}${cmds.name}.${cmds.value}`
//   // cmds.value = {}
//   // cmds.act = 'updateProp'
//   // addressAddressor(window.chronicle.plans.propsUpdate[cmds.prop], cmds.address, cmds.value)
//   // ajax(JSON.stringify(cmds))
//   console.log('addPropAttribute', cmds)  
// }

// Delete an attribute which is an attribute container.
const deletePropAttribute = (cmds) => {
  cmds.prop = window.chronicle.prop
  cmds.act = 'deletePropAttribute'
  addressDestructor(window.chronicle.plans.propsUpdate[cmds.prop], cmds.address)
  ajax(JSON.stringify(cmds)) 
  // console.log('deleteAttribute', cmds)
}

const addressDestructor = (plans, address) => {
  const [prime, genus, order] = address.split('.')
  if (order) return delete(plans[prime][genus][order])
  if (genus) return delete(plans[prime][genus])
  if (prime) return delete(plans[prime])
}

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

const renderButton = (cssClass, iconCode, func) => {
  let icon = '💾' // save/update
  if (iconCode == 'delete') icon = '➖' // delete 🚽 🗑 ☠ 🚮
  if (iconCode == 'add') icon = '➕' // add ✅ 🉑 ❌ 
 
  let el = elCom('span', { 
    classes: `objButton ${cssClass}`, 
    text: icon
  })

  el.setAttribute('title', iconCode)
  elAel(el, func)
  return el
}

const elCom = (elType, cmds) => {
  let el = document.createElement(elType)
  if (!cmds) return el
  if (cmds.id) el.id = cmds.id
  if (cmds.classes) el.className = cmds.classes
  if (cmds.text) el.innerText = cmds.text
  if (cmds.value) el.value = cmds.value
  if (cmds.func) elAel(el, cmds.func, cmds.act )

  return el
}

const elAel = (el, funk, act) => {
  if (!act) act = 'click'
  el.addEventListener(act, funk)
}

const ajax = (cmds) => {
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      // console.log('xhr: 200', xhr.responseText)
      // console.log('pps', window.chronicle.plans.props)
      
      let data = JSON.parse(xhr.responseText)

      // console.log('server data', data)

      if (!data.error) {
        console.log(window.chronicle.plans.propsUpdate)
        
        window.chronicle.plans.props = window.chronicle.plans.propsUpdate
        edit(data.prop)
      }
    }
    //console.log('xhr:', xhr.responseText)
  }
  xhr.open('POST', 'http://localhost:8888/save/prop', true)
  xhr.send(cmds)
}
