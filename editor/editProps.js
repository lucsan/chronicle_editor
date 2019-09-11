'strict'


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
  // let b = renderButton('add', 'add', () => { updateProp({ act: 'add', valueElId: id }) })
  let b = renderButton('add', 'add', () => { prepAndPostPropValues({ act: 'add', valueElId: id }) })

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

// const nameLevelElement = (name, address, indClass) => {
//   let e = elCom('div', { classes: `attrib ${indClass}`})
//   const id = `${address}${name}`
//   e.appendChild(elCom('span', { text: name, classes: `title ${indClass}` }))
//   e.appendChild(elCom('textarea', { id: id, classes: 'textareaShort' }))
//   e.appendChild(renderObjectButtons({name: name, address: address, valueElId: id }))
//   return e
// }

// const valueLevelElement = (obj, name, address, indClass) => {
//   let e = elCom('div', { classes: `attrb ${indClass}` })
//   const id = `${address}${name}`
//   e.appendChild(elCom('span', { text: '*' + name, classes: 'title' }))
//   e.appendChild(elCom('textarea', { id: id, classes: 'textareaLong', value: obj[name] }))
//   e.appendChild(renderValueButtons({name, address, valueElId: id }))
//   return e
// }

// const renderObjectButtons = (cmds) => {
//   const address = `${cmds.address}${cmds.name}`
//   let btns = elCom('span', { classes: 'buttons' })

//   const addressItems = address.split('.')
//   if (addressItems.length < 3) {
//     btns.appendChild(renderButton('add', 'add', () => { prepAndPostPropValues({ ...cmds, act: 'add' }) }))  
//   }

//   btns.appendChild(renderButton('update', 'update', () => { prepAndPostPropValues(cmds) }))  

//   btns.appendChild(renderButton('delete', 'delete', () => {
//     deletePropAttribute({ ...cmds, address: address }) 
//   }))


//   return btns
// }

// const renderValueButtons = (cmds) => {
//   const address = `${cmds.address}${cmds.name}`
//   let btns = elCom('span')
//   btns.appendChild(renderButton('update', 'update', () => { prepAndPostPropValues(cmds) }))

//   btns.appendChild(renderButton('delete', 'delete', () => {
//     deletePropAttribute({ ...cmds, address: address, value: document.getElementById(cmds.valueElId).value })
//   }))
//   return btns
// }

// const prepAndPostPropValues = (cmds) => {
//   // console.log('recievedValues', {...cmds}, action)

//   let { name, address, valueElId, act } = cmds
//   let value = document.getElementById(valueElId).value 

//   const obj = makeAddress({ address, name, value, act })
//   if (act) { 
//     obj.act = act
//   } else {
//     obj.act = 'updateProp'
//   }
//   obj.prop = window.chronicle.prop  

//   console.log('obj', obj)  

//   //addressAddressor(window.chronicle.plans.propsUpdate[obj.prop], obj.address, obj.value)
 
//   ajax(JSON.stringify(obj))
//   // return obj
// }



// Delete an attribute which is an attribute container.
const deletePropAttribute = (cmds) => {
  cmds.prop = window.chronicle.prop
  cmds.act = 'deletePropAttribute'
  addressDestructor(window.chronicle.plans.propsUpdate[cmds.prop], cmds.address)
  ajax(JSON.stringify(cmds)) 
  // console.log('deleteAttribute', cmds)
}


