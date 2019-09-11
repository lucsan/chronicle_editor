'strict'

window.chronicle.plans.setsUpdate = setsPlans

window.onload = () => edit()

const edit = (set) => {
  console.log('editing', set)
  
  set = checkCurrentSet(set)

  let output = document.getElementById('output')
  output.innerHTML = ''

  output.appendChild(listsPlansItems('props'))
  output.appendChild(listsPlansItems('sets', 'edit', addNewItem('Set')))
  
  if (typeof window.chronicle.set == 'undefined') return

  output.appendChild(currentPlan(set))
  output.appendChild(addNewAttribute('set'))

  const plans = window.chronicle.plans.sets[set]    
  const attribElems = elementsFromObjects(plans, elCom('div'))

  // let mds = missingDefaults(window.chronicle.plans.props[prop])
  let mds = []
  const defaults = elementsFromObjects(mds, elCom('div', { id: 'missingDefaults', classes: 'missingDefaults' } ))    

  output.appendChild(attribElems)
  output.appendChild(defaults)
}


const nameLevelElement = (name, address, indClass) => {
  let e = elCom('div', { classes: `attrib ${indClass}`})
  const id = `${address}${name}`
  e.appendChild(elCom('span', { text: name, classes: `title ${indClass}` }))
  e.appendChild(elCom('textarea', { id: id, classes: 'textareaShort' }))
  e.appendChild(renderObjectButtons({name: name, address: address, valueElId: id }))
  return e
}

const renderObjectButtons = (cmds) => {
  const address = `${cmds.address}${cmds.name}`
  let btns = elCom('span', { classes: 'buttons' })

  const addressItems = address.split('.')
  if (addressItems.length < 3) {
    btns.appendChild(renderButton('add', 'add', () => { prepAndPostValues({ ...cmds, act: 'add' }) }))  
  }

  btns.appendChild(renderButton('update', 'update', () => { prepAndPostValues(cmds) }))  

  btns.appendChild(renderButton('delete', 'delete', () => {
    deleteAttribute({ ...cmds, address: address }) 
  }))


  return btns
}

const valueLevelElement = (obj, name, address, indClass) => {
  let e = elCom('div', { classes: `attrb ${indClass}` })
  const id = `${address}${name}`
  e.appendChild(elCom('span', { text: '*' + name, classes: 'title' }))
  e.appendChild(elCom('textarea', { id: id, classes: 'textareaLong', value: obj[name] }))
  e.appendChild(renderValueButtons({name, address, valueElId: id }))
  return e
}

const renderValueButtons = (cmds) => {
  const address = `${cmds.address}${cmds.name}`
  let btns = elCom('span')
  btns.appendChild(renderButton('update', 'update', () => { prepAndPostValues(cmds) }))

  btns.appendChild(renderButton('delete', 'delete', () => {
    deleteAttribute({ ...cmds, address: address, value: document.getElementById(cmds.valueElId).value })
  }))
  return btns
}

// Delete an attribute which is an attribute container.
const deleteAttribute = (cmds) => {
  cmds.set = window.chronicle.set
  cmds.act = 'deleteAttribute'
  //addressDestructor(window.chronicle.plans.propsUpdate[cmds.prop], cmds.address)

  // ajax(JSON.stringify(cmds)) 

}


const addNewAttribute = (type) => {
  const id = 'newAttribute'
  let na = elCom('div', {})
  let t= elCom('textarea', { id: id, classes: 'textareaShort' })
  let b = renderButton('add', 'add', () => { prepAndPostValues({ act: 'add', valueElId: id }) })

  na.appendChild(elCom('span', { text: 'New Attrib' } ))
  na.appendChild(t)
  na.appendChild(b)

  return na
}

const prepAndPostValues = (cmds) => {
  //console.log('recievedValues', {...cmds}, action)
  let { name, address, valueElId, act, type } = cmds
  let value = document.getElementById(valueElId).value

  console.log('xxxxxxxxxxxxxxx', cmds, value)
  

  const obj = makeAddress({ address, name, value, act })

  console.log('yyyyyyyyyyyyy', obj)
  
  //obj.type = type
  if (act) { 
    obj.act = act
  } else {
    obj.act = 'update'
  }
  obj.prop = window.chronicle.prop
  obj.set = window.chronicle.set

  console.log(obj)
  

  // addressAddressor(window.chronicle.plans.propsUpdate[obj.prop], obj.address, obj.value)
 
  ajax(JSON.stringify(obj))

}


// const prepAndPostPropValues = (cmds, action) => {
//   // console.log('recievedValues', {...cmds}, action)

//   let { name, address, valueElId, act } = cmds
//   let value = document.getElementById(valueElId).value 

//   const obj = makeAddress({ address, name, value, act })
//   if (action) { 
//     obj.act = action
//   } else {
//     obj.act = 'updateProp'
//   }
//   obj.prop = window.chronicle.prop  

//   console.log('obj', obj)  

//   addressAddressor(window.chronicle.plans.propsUpdate[obj.prop], obj.address, obj.value)
 
//   ajax(JSON.stringify(obj))
//   // return obj
// }

const checkCurrentSet = (set) => {
  if (set != null) { 
    localStorage.setItem('chronicleSet', set)
  } else {
    set = localStorage.getItem('chronicleSet')
  }
  window.chronicle.set = set
  return set
}

const listsPlansItems = (type, func, newItem) => {

  let ul = elCom('ul', { id: `${type}List`, classes: `${type}List ${type}` })
  let plans = type == 'props'? window.chronicle.plans.props: window.chronicle.plans.sets
  
  if (newItem) ul.appendChild(newItem)  
  for (let str in plans) {
    let o = { text: str }
    if (func == 'edit') o.func = () => { edit(str) }
    ul.appendChild(elCom('li', o))
  }
  return ul
}

const addNewItem = (type) => {
  let e = elCom('div', { id: `new${type}` })
  e.innerText = `New ${type}`
  e.className = 'button'
  elAel(e, () => { edit('new') })
  return e
}

const currentPlan = (plan) => {
  let w = elCom('div', { id: 'item-title' })
  w.appendChild(elCom('div', { text: plan, classes: 'title' }))
  w.appendChild(elCom('div', { id: 'attributes', classes: 'edit' }))
  return w
}

