'strict'
window.onload = () => edit()
window.chronicle = {}
window.chronicle.meta = {}
window.chronicle.propsPlans = propsPlans
window.chronicle.prop = {}
window.chronicle.meta = {}

const edit = (prop) => {
  window.chronicle.prop = prop  
  //console.log(window.chronicle.propsPlans)

  window.chronicle.meta = infersMetaData()

  let output = document.getElementById('output')
  output.innerHTML = ''

  let locList = listsLocations()
  output.appendChild(locList)

  // const tst = JSON.stringify({ act: 'updateProp', prop: 'stick', address: 'actions.inv.bosh', value: 'do boshings' })
  //  ajax(tst)

  renderPropsList(output)
  if (typeof prop == 'undefined') return

  let e = document.createElement('div')
  e.id = 'propAttribs'
  e.className = 'propsEdit'

  const fullPlan = window.chronicle.propsPlans[prop]    
  //const metaData = infersMetaData(fullPlan)

  const htmlAttrs = elementsFromObjects(fullPlan, e)

  const t = renderProp(prop)

  let md = elCom('div', { id: 'missingDefaults', classes: 'missingDefaults' } )
  let mds = missingDefaults(window.chronicle.propsPlans[prop])
   elementsFromObjects(mds, md, 'default')    

  output.appendChild(t)
  output.appendChild(htmlAttrs)
  output.appendChild(md)
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

const renderProp = (prop) => {
  let e = elCom('div', { id: 'prop' })
  let t = elCom('span', { text: prop, classes: 'title' })
  // t.innerText = prop
  // t.className = 'title'
  let i = elCom('textarea', { text: prop, classes: 'textareaLong' })
  // i.className = 'textareaLong'
  // i.innerText = prop

  let a = renderButton('prop update', 'save', () => { newProp(i) })
  let d = renderButton('prop delete', 'delete', () => { console.log(`delete prop ${prop}`) })

  e.appendChild(t)
  e.appendChild(i)
  e.appendChild(a)
  e.appendChild(d)

  return e
}

const renderPropsList = (output) => {

  let c = elCom('div', { id: 'thingsList' })
  let e = elCom('div', { id: 'newProp' })
  e.innerText = 'New Prop'
  e.className = 'button'
  elAel(e, () => { edit('new') })

  c.appendChild(e)

  for (const p in window.chronicle.propsPlans) {
    let el = elCom('div', { id: p })
    el.innerText = p
    el.className = `button ${p}`
    elAel(el, () => { edit(p) })
    c.appendChild(el)
  }

  output.appendChild(c)
}

const addsDefaults = (targetProp) => {
  const dp = defaultProp()
  for (let i in dp) {
    if (!targetProp[i]) {
      targetProp[i] = dp[i]
    }
  }
  return targetProp
}

const infersMetaData = () => {
  //console.log('infering')
  let a = {}
  let s = ''
  let b = {}
  const walk = (obj, a, s) => {
    for (let k in obj) {
    
      if (typeof(obj[k]) == 'object' 
        && !Array.isArray(obj[k]) 
        && Object.keys(obj[k]).length !== 0) {

        a[k] = obj[k]
        s += `${k}.`

        walk(obj[k], a[k], s)
        s = s.substring(0, s.length - k.length - 2) 
      } else {
        let tpo = typeof obj[k]
        if (Array.isArray(obj[k])) tpo = 'array'
        let t = `${s}${k}`    
        a[k] = tpo
        b[t] = tpo
      }
    }
  }
  walk(defaultProp(), a, s)

  //console.log('infers', b, a)
  
  return b
}

const elementsFromObjects = (object, el, isDefault) => {

  if (isDefault == null) {
    let na = elCom('div', {})
    //na.innerText = 'New Attrib'
    let s = elCom('span', { text: 'New Attrib' } )
    let t= elCom('textarea', { id: 'newPropAttrib', classes: 'textareaShort' })
    let b = renderButton('save', 'save', () => { addPropAttribute('newPropAttrib') })

    el.appendChild(na)
    na.appendChild(s)
    na.appendChild(t)
    na.appendChild(b)

  }


  const walk = (obj, ind, pa) => {
    let indClass = indentClass(ind)
    for (let k in obj) {
      if (typeof(obj[k]) == 'object' && !Array.isArray(obj[k])) {
        nameLevelElement(el, k, pa, indClass)
        walk(obj[k], ++ind, pa += `${k}.`)
        --ind
        pa = pa.replace(`${k}.`, '')
      } else {
        valueLevelElement(el, obj, k, pa, indClass)
      }
    }
  }
  walk(object, 0, '')

  return el
}

const addPropAttribute = (elId) => {
  let el = document.getElementById(elId)
  if (el.value == '') return
  const cmds = JSON.stringify({ act: 'newPropAttrib', attrib:  el.value, prop: window.chronicle.prop })
  ajax(cmds)

  console.log('addPropAttribute', elId, el.value)  

}

// const addedAttribute = () => {

// }

// const deletedAttribute = () => {

// }

const newProp = (el) => {
  const cmds = JSON.stringify({ act: 'newProp', prop:  el.value })
  ajax(cmds)
}

const addedProp = (prop) => {
  let output = document.getElementById('output')
  output.innerHTML = ''
  window.chronicle.propsPlans[prop] = {}
  edit(prop)
}

const deletedProp = (prop) => {
  let output = document.getElementById('output')
  output.innerHTML = ''
  window.chronicle.propsPlans[prop] = {}
  edit(prop)
}
  

const updateProp = (el, prop, address) => {
  console.log(window.chronicle.meta, address)
  let value = el.value
  if (window.chronicle.meta[address] && window.chronicle.meta[address] == 'array') {

    const a = value.split(',')
    value = [`${a.join(`','`)}`]
    console.log('meta found', value)
    
  }
  
  const cmds = JSON.stringify({ act: 'updateProp', prop: prop, address: address, value: value })
  ajax(cmds)
}

const deleteProp = (el, prop, address) => {
  const cmds = JSON.stringify({ act: 'deleteProp', prop: prop, address: address, value: el.value })
  ajax(cmds)
}

const nameLevelElement = (el, k, pa, indClass) => {

  // let s = document.createElement('span')
  // s.innerText = k
  // s.className = `title ${indClass}`

  // let i = document.createElement('textarea')
  // i.id = `${pa}${k}`
  // i.className = 'textareaShort'

  let s = elCom('span', { text: k, classes: `title ${indClass}` })
  let ta = elCom('textarea', { id: `${pa}${k}`, classes: 'textareaShort' })
  let sb = renderButton('save', 'save', () => console.log('save prop attribute'))
  let b = renderButton(`addPropAttribute ${pa}${k}`, 'add', () => { addPropAttribute(`${pa}${k}`) })
  let e = elCom('div', { classes: `attrib ${indClass}`})

  e.appendChild(s)
  e.appendChild(ta)
  e.appendChild(sb)
  e.appendChild(b)
  el.appendChild(e)
}

const valueLevelElement = (el, obj, k, pa, indClass) => {
  let i = elCom('textarea', { id: `${pa}${k}`, classes: 'textareaLong' })
  i.value = obj[k]  

  let s = document.createElement('span')
  s.innerText = k
  s.className = 'title'

  let b = renderButton(`updateProp ${pa}${k}`, 'save', () => { updateProp(i, window.chronicle.prop, `${pa}${k}`) })
  //elAel(b, () => { updateProp(i, window.chronicle.prop, `${pa}${k}`) })

  let d = renderButton(`deleteProp ${pa}${k}`, 'delete', () => { deleteProp(i, window.chronicle.prop, `${pa}${k}`) })
  //d.addEventListener('click', () => { deleteProp(i, window.chronicle.prop, `${pa}${k}`) })

  let e = elCom('div', { classes: `attrb ${indClass}` })

  e.appendChild(s)
  e.appendChild(i)
  e.appendChild(b)
  e.appendChild(d)
  el.appendChild(e)
}

const renderButton = (cssClass, iconCode, func) => {
  let icon = '💾' // add/update
  if (iconCode == 'delete') icon = '➖'
  if (iconCode == 'add') icon = '➕'

  let el = elCom('span', { 
    classes: `objButton ${cssClass}`, 
    text: icon
  })

  el.setAttribute('title', iconCode)
  elAel(el, func)
  return el
}

const indentClass = (ind) => {
  if (ind > 0) return `indent_${ind}`
  return ''
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

const elCom = (elType, cmds) => {
  let el = document.createElement(elType)
  if (!cmds) return el
  if (cmds.id) el.id = cmds.id
  if (cmds.classes) el.className = cmds.classes
  if (cmds.text) el.innerText = cmds.text
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
      console.log('pps', window.chronicle.propsPlans)
      
      let data = JSON.parse(xhr.responseText)

      console.log(data)

      if (data.act == 'addedProp') addedProp(data.prop)
      if (data.act == 'deletedProp') deletedProp(data.prop)
      

    }
    //console.log('xhr:', xhr.responseText)

    
  }
  xhr.open('POST', 'http://localhost:8888/save/prop', true)
  xhr.send(cmds)
}
