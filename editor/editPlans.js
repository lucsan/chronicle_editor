'strict'

window.chronicle = {}
window.chronicle.plans = {}
window.chronicle.plans.props = propsPlans
window.chronicle.plans.sets = setsPlans

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
  const itemType = cmds.prop? cmds.prop: cmds.sets
  let btns = elCom('span', { classes: 'buttons' })

  const addressItems = address.split('.')
  if (addressItems.length < 3) {
    // btns.appendChild(renderButton('add', 'add', () => { prepAndPostValues({ ...cmds, act: 'add' }) }))  
    btns.appendChild(renderButton('add', 'add', () => { postServerCommand({ ...cmds, act: 'add', address }) }))  
  }

  btns.appendChild(renderButton('update', 'update', () => { postServerCommand({ ...cmds, act: 'update', address }) }))  
  // btns.appendChild(renderButton('update', 'update', () => { prepAndPostValues({ ...cmds, act: 'update' }) }))  

  btns.appendChild(renderButton('delete', 'delete', () => {
    deleteAttribute({ ...cmds, address: address }) 
  }))


  return btns
}

const renderValueButtons = (cmds) => {
  const address = `${cmds.address}${cmds.name}`
  let btns = elCom('span')
  btns.appendChild(renderButton('update', 'update', () => { postServerCommand({ ...cmds, act: 'update' }) }))
  // btns.appendChild(renderButton('update', 'update', () => { prepAndPostPropValues({ ...cmds, act: 'update' }) }))

  btns.appendChild(renderButton('delete', 'delete', () => {
    deletePropAttribute({ ...cmds, address: address, value: document.getElementById(cmds.valueElId).value })
  }))
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

// if only value then value = address of new item
const makeAnAddress = (data = {}) => {
  // console.log(data)

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

const ajax = (cmds) => {
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      let data = JSON.parse(xhr.responseText)

      console.log('server data', data)

      if (!data.error) {
        //console.log(window.chronicle.plans.propsUpdate)
        
        //window.chronicle.plans.props = window.chronicle.plans.propsUpdate
        if (data.prop) {
          window.chronicle.plans.props = propsPlans
          edit(data.prop)
        }
        if (data.set) {
          window.chronicle.plans.sets = setsPlans
          edit(data.set)
        }
        

        
      }
    }
    //console.log('xhr:', xhr.responseText)
  }
  xhr.open('POST', 'http://localhost:8888/save/prop', true)
  xhr.send(cmds)
}