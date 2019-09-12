'strict'

window.chronicle = {}
window.chronicle.plans = {}
window.chronicle.plans.props = propsPlans
window.chronicle.plans.sets = setsPlans

const addressDestructor = (address, plans) => {
  const [one, two, thr, fou, fiv] = address.split('.')
  if (fiv) return delete(plans[one][two][thr][fou][fiv])
  if (fou) return delete(plans[one][two][thr][fou])
  if (thr) return delete(plans[one][two][thr])
  if (two) return delete(plans[one][two])
  if (one) return delete(plans[one])
}

const addressAddressor = (address, value, plans) => {
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


const elementsFromPlans = (plans, itemType, item, el) => {

  const walk = (obj, ind, pa) => {
    let indClass = indentClass(ind)
    for (let k in obj) {
      if (
        typeof obj[k] == 'object' && 
          (
            !Array.isArray(obj[k]) || 
            typeof obj[k][0] == 'object'
          )
      ) {
        //if (!Array.isArray(obj[k])) 
        el.appendChild(nameLevelElement(k, pa, indClass, itemType, item))

        walk(obj[k], ++ind, pa += `${k}.`)
        --ind
        pa = pa.replace(`${k}.`, '')
      } else {
        el.appendChild(valueLevelElement(k, pa, indClass, obj, itemType, item))
      }
    }
  }
  walk(plans, 0, '')

  return el
}

const checkCurrentItem = (itemType, item) => {
  if (item != null) { 
    localStorage.setItem(`chronicle${itemType}`, item)
  } else {
    item = localStorage.getItem(`chronicle${itemType}`)
  }
  window.chronicle[itemType] = item
  return item
}

const nameLevelElement = (name, address, indClass, itemType, item) => {
  let e = elCom('div', { classes: `attrib ${indClass}`})
  const id = `${address}${name}`
  e.appendChild(elCom('span', { text: name, classes: `title ${indClass}` }))
  e.appendChild(elCom('textarea', { id: id, classes: 'textareaShort' }))
  e.appendChild(renderObjectButtons({ [itemType]: item, name, address, valueElId: id }))
  return e
}

const valueLevelElement = (name, address, indClass, obj, itemType, item) => {
  let e = elCom('div', { classes: `attrb ${indClass}` })
  const id = `${address}${name}`
  e.appendChild(elCom('span', { text: '*' + name, classes: 'title' }))
  e.appendChild(elCom('textarea', { id: id, classes: 'textareaLong', value: obj[name] }))
  e.appendChild(renderValueButtons({ [itemType]: item, name, address, valueElId: id }))
  return e
}

const renderObjectButtons = (cmds) => {
  const address = `${cmds.address}${cmds.name}`
  let btns = elCom('span', { classes: 'buttons' })
  const addressItems = address.split('.')

  if (addressItems.length < 3) {
    btns.appendChild(renderButton('add', 'add', () => { postServerCommand({ ...cmds, act: 'add', address }) }))  
  }
  btns.appendChild(renderButton('update', 'update', () => { postServerCommand({ ...cmds, act: 'update', address }) }))  
  btns.appendChild(renderButton('delete', 'delete', () => { postServerCommand({ ...cmds, act: 'delete', address }) }))
  return btns
}

const renderValueButtons = (cmds) => {
  const address = `${cmds.address}${cmds.name}`
  let btns = elCom('span')
  btns.appendChild(renderButton('update', 'update', () => { postServerCommand({ ...cmds, act: 'update', address }) }))
  btns.appendChild(renderButton('delete', 'delete', () => { postServerCommand({ ...cmds, act: 'delete', address }) }))
  return btns
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

const postServerCommand = (cmds) => {
  ajax(JSON.stringify(prepServerValues(cmds)))
}

// Server requires: act, set or prop, [address], [value]
const prepServerValues = (data = {}) => {
  data.value = document.getElementById(data.valueElId).value
  delete(data.valueElId)
  return makeAnAddress(data)
}

const makeAnAddress = (data = {}) => {
  if (!data.address) {
    if (data.value) data.address = data.value
    delete(data.value)
  }

  if (data.act == 'add' && data.address && data.value) {
    data.address = `${data.address}.${data.value}`
    delete(data.value)
  }  

  delete(data.name)
  return data
}

const addNewItem = (type) => {
  let e = elCom('div', { id: `new${type}` })
  e.innerText = `New ${type}`
  e.className = 'button'
  elAel(e, () => { edit('new') })
  return e
}

const addNewAttribute = (itemType, itemName) => {
  const id = 'newAttribute'
  let el = elCom('div', {})
  let t = elCom('textarea', { id, classes: 'textareaShort', itemType, item: itemName })
  let b = renderButton(
    'add', 
    'add', 
    () => { postServerCommand({ 
      act: 'add', 
      [itemType]: itemName, 
      valueElId: id 
    }) })

  el.appendChild(elCom('span', { text: 'New Attr', classes: 'title' } ))
  el.appendChild(t)
  el.appendChild(b)
  return el
}

const listsPlansItems = (type, func, newItem) => {
  const active = func? 'activeItemsList': ''

  let ul = elCom('ul', { id: `${type}List`, classes: `${type}List ${type} list ${active}` })
  let plans = type == 'props'? window.chronicle.plans.props: window.chronicle.plans.sets
  
  if (newItem) ul.appendChild(newItem)  
  for (let str in plans) {
    let o = { text: str }
    if (func == 'edit') o.func = () => { edit(str) }
    ul.appendChild(elCom('li', o))
  }
  return ul
}


const indentClass = (ind) => {
  if (ind > 0) return `indent_${ind}`
  return ''
}

const elCom = (elType, cmds) => {
  let el = document.createElement(elType)
  if (!cmds) return el
  if (cmds.id) el.id = cmds.id
  if (cmds.classes) el.className = cmds.classes
  if (cmds.text) el.innerText = cmds.text
  if (cmds.value) el.value = cmds.value
  if (cmds.data) el.setAttribute('data-data', cmds.data)
  if (cmds.item) el.setAttribute('data-item', cmds.item)
  if (cmds.itemType) el.setAttribute('data-itemType', cmds.itemType)
  if (cmds.address) el.setAttribute('data-address', cmds.address)

  if (cmds.func) elAel(el, cmds.func, cmds.act )

  return el
}

const elAel = (el, funk, act) => {
  if (!act) act = 'click'
  el.addEventListener(act, funk)
}

const serverUpdates = (data) => {
  // added
  // deletedItem
  // updatedAttribute
  // deletedAttribute

  data.itemType = data.prop? 'props': 'sets'
  data.item = data.prop? data.prop: data.set

  if (data.act == 'added') serverAdded(data)
  if (data.act == 'updatedAttribute') serverUpdated(data)
  if (data.act == 'deletedAttribute') serverDeletedAttribute(data)

  edit(data.item)
      
}

const serverDeletedAttribute = (data) => {
  addressDestructor(data.address, window.chronicle.plans[data.itemType][data.item])
}

const serverUpdated = (data) => {
  addressAddressor(data.address, data.value, window.chronicle.plans[data.itemType][data.item])
}

const serverAdded = (data) => {
  if (!data.address) {
    window.chronicle.plans[data.itemType][data.item] = {}
  } else {
    addressAddressor(data.address, data.value, window.chronicle.plans[data.itemType][data.item])
  }
}

const harden = (plansType) => {
  ajax(JSON.stringify({ act: 'harden', plans: plansType }))
}

const ajax = (cmds) => {
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText)

      console.log('server data', data)
      if (!data.error) { serverUpdates(data) }
    }
    //console.log('xhr:', xhr.responseText)
  }
  xhr.open('POST', 'http://localhost:8888/save/prop', true)
  xhr.send(cmds)
}

// // Delete an attribute which is an attribute container.
// const deleteAttribute = (cmds) => {
//   cmds.set = window.chronicle.set
//   cmds.act = 'deleteAttribute'
//   //addressDestructor(window.chronicle.plans.propsUpdate[cmds.prop], cmds.address)

//   // ajax(JSON.stringify(cmds)) 

// }

// // Delete an attribute which is an attribute container.
// const deletePropAttribute = (cmds) => {
//   cmds.prop = window.chronicle.prop
//   cmds.act = 'deletePropAttribute'
//   addressDestructor(window.chronicle.plans.propsUpdate[cmds.prop], cmds.address)
//   ajax(JSON.stringify(cmds)) 
//   // console.log('deleteAttribute', cmds)
// }