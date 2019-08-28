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

const renderObjectButtons = (cmds) => {
  const address = `${cmds.address}${cmds.name}`
  let btns = elCom('span', { classes: 'buttons' })
  btns.appendChild(renderButton('save', 'save', () => {}))  
  btns.appendChild(renderButton('delete', 'delete', () => {
    deletePropAttribute({...cmds, address: address}) 
  }))
  btns.appendChild(renderButton('add', 'add', () => {}))  
  return btns
}

const valueLevelElement = (obj, name, address, indClass) => {
  let e = elCom('div', { classes: `attrb ${indClass}` })
  const id = `${address}${name}`
  e.appendChild(elCom('span', { text: 'v ' + name, classes: 'title' }))
  e.appendChild(elCom('textarea', { id: id, classes: 'textareaLong', value: obj[name] }))
  e.appendChild(renderValueButtons({name, address, valueElId: id }))
  return e
}

const renderValueButtons = (cmds) => {
  let btns = elCom('span')

  btns.appendChild(renderButton('update', 'update', () => {
    updateProp({
      act: 'updateProp', 
      address: `${cmds.address}${cmds.name}`,
      value: document.getElementById(cmds.valueElId).value
    })
  }))

  btns.appendChild(renderButton('delete', 'delete', () => {}))
  return btns
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
  let b = renderButton('save', 'save', () => { 
    updateProp({
      act: 'updateProp', 
      value: document.getElementById(id).value
    })
  })

  na.appendChild(elCom('span', { text: 'New Attrib' } ))
  na.appendChild(t)
  na.appendChild(b)

  return na
}


const updateProp = (cmds) => {
  cmds.prop = window.chronicle.prop
  ajax(JSON.stringify(cmds))

  console.log('updateProp', cmds)
  
}

// Delete an attribute which is an attribute container.
const deletePropAttribute = (cmds) => {




  cmds.prop = window.chronicle.prop
  cmds.act = 'deletePropAttribute'

  //cmds.address = 'barry.aaaaa'

  addressDestructor(window.chronicle.plans.propsUpdate[cmds.prop], cmds.address)

  console.log('update', window.chronicle.plans.propsUpdate.barry)
  

  //window.chronicle.plans.props[cmds.prop]

  ajax(JSON.stringify(cmds)) 
  console.log('deleteAttribute', cmds)
  
}

const addressDestructor = (plans, address) => {
  const [prime, genus, order] = address.split('.')
  if (order) return delete(plans[prime][genus][order])
  if (genus) return delete(plans[prime][genus])
  if (prime) return delete(plans[prime])
}

// Delete an attribute which is a value container.
const deletePropValue = () => {
  
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
      console.log('xhr: 200', xhr.responseText)
      console.log('pps', window.chronicle.plans.props)
      
      let data = JSON.parse(xhr.responseText)

      console.log('server data', data)

      //if (data.act == 'addedProp') addedProp(data.prop)
      //if (data.act == 'deletedProp') deletedProp(data.prop)

      
      // let output = document.getElementById('output')
      // output.innerHTML = ''
      // window.chronicle.plans.props[data.prop] = {}
      // //edit(prop)
      // edit(data.prop)

      if (data.act == 'deletedPropAttribute') {
        window.chronicle.plans.props = window.chronicle.plans.propsUpdate
        edit(data.prop)
      }
      

    }
    //console.log('xhr:', xhr.responseText)

    
  }
  xhr.open('POST', 'http://localhost:8888/save/prop', true)
  xhr.send(cmds)
}
