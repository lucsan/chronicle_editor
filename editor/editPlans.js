'strict'
window.onload = () => edit()
window.chronicle = {}
window.chronicle.meta = {}
window.chronicle.propsPlans = propsPlans
window.chronicle.prop = {}
window.chronicle.meta = {}

const edit = (prop) => {
  window.chronicle.prop = prop  
  console.log(window.chronicle.propsPlans)

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

  // const fullPlan = addsDefaults(propsPlans[prop])
  const fullPlan = window.chronicle.propsPlans[prop]    
  //const metaData = infersMetaData(fullPlan)

  const htmlAttrs = walks(fullPlan, e)

  const t = renderProp(prop)

  let md = elCom('div', 'missingDefaults')
  md.className = 'missingDefaults'
  let mds = missingDefaults(window.chronicle.propsPlans[prop])
  // mds[prop] = missingDefaults(window.chronicle.propsPlans[prop])
  walks(mds, md)    

 

  // Noted for later automation
  let mb = document.createElement('div')
  mb.innerText = 'make into a box'

  output.appendChild(mb)
  output.appendChild(t)
  output.appendChild(htmlAttrs)
  output.appendChild(md)


}

const missingDefaults = (targetProp) => {
  let missing = []
  const dp = defaultProp()
  for (let i in dp) {
    if (!targetProp[i]) {
      missing[i] = dp[i]
    }
  }
  return missing
}

const renderProp = (prop) => {
  let e = document.createElement('div')
  e.id = 'prop'
  let t = document.createElement('span')
  t.innerText = prop
  t.className = 'title'
  let i = document.createElement('textarea')
  i.className = 'textareaLong'
  i.innerText = prop

  let a = renderButton('prop update', 'save')
  a.addEventListener('click', () => { newProp(i) })

  let d = renderButton('prop delete', 'delete')
  d.addEventListener('click', () => {console.log(`delete prop ${prop}`)})

  e.appendChild(t)
  e.appendChild(i)
  e.appendChild(a)
  e.appendChild(d)

  return e
}

const renderPropsList = (output) => {

  let c = elCom('div', 'thingsList')
  let e = elCom('div', 'newProp')
  e.innerText = 'New Prop'
  e.className = 'button'
  elAel(e, () => { edit('new') })

  c.appendChild(e)

  for (const p in window.chronicle.propsPlans) {
    let el = elCom('div', p)
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
//console.log('s',s, 'name', k, obj[k])


        walk(obj[k], a[k], s)

        s = s.substring(0, s.length - k.length - 2) 

  

      } else {
        //console.log('value', obj[k], k, typeof obj[k], obj, a)
        let tpo = typeof obj[k]
        if (Array.isArray(obj[k])) tpo = 'array'

        //console.log('value', 'k', k, 's', s)
        //s += `${k}-`
        let t = `${s}${k}`
        //console.log('new s', s)        
        a[k] = tpo
        b[t] = tpo
        //s = ''
        //s = s.substring(0, s.length - k.length + 1) 
        //s = s.substring(0, s.length) 
        //console.log('new new s', t)              
        //s += tpo
      }
    }
  }
  walk(defaultProp(), a, s)

  //console.log('infers', b, a)
  
  return b
}

const walks = (object, el) => {
  let e = document.createElement('div')

  const walk = (obj, e, ind, pa) => {
    let indClass = indentClass(ind)
    for (let k in obj) {
      if (typeof(obj[k]) == 'object' && !Array.isArray(obj[k])) {
        nameLevelElement(el, k, pa, indClass)
        walk(obj[k], e, ++ind, pa += `${k}.`)
        --ind
        pa = pa.replace(`${k}.`, '')
      } else {
        valueLevelElement(el, obj, k, pa, indClass)
      }
    }
  }
  walk(object, e, 0, '')

  return el
}


const addAttribute = (a, b) => {
  let e = document.getElementById(a)
  console.log('addAttribute', a, b, e.value)  

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
  let e = document.createElement('div')
  //e.id = `${pa}${k}`
  //e.dataset.pa = pa
  //e.dataset.ty = 'ob'
  e.className = `attrib ${indClass}`

  let s = document.createElement('span')
  s.innerText = k
  s.className = `title ${indClass}`

  let i = document.createElement('textarea')
  i.id = `${pa}${k}`
  i.className = 'textareaShort'

  let b = renderButton(`addAttribute ${pa}${k}`, 'add')
  b.addEventListener('click', () => {addAttribute(`${pa}${k}`)})

  e.appendChild(s)
  e.appendChild(i)
  e.appendChild(b)
  el.appendChild(e)
}

const valueLevelElement = (el, obj, k, pa, indClass) => {
  //console.log(el, obj, k, pa, indClass)
  
  let e = document.createElement('div')
  e.className = `attrb ${indClass}`
  //e.dataset.pa = pa
  //e.dataset.ty = 'vl'

  let i = document.createElement('textarea')
  i.id = `${pa}${k}`
  i.value = obj[k]
  i.className = 'textareaLong'

  let s = document.createElement('span')
  s.innerText = k
  s.className = 'title'

  let b = renderButton(`updateProp ${pa}${k}`)
  b.addEventListener('click', () => {updateProp(i, window.chronicle.prop, `${pa}${k}`)})

  let d = renderButton(`deleteProp ${pa}${k}`, 'delete')
  d.addEventListener('click', () => {deleteProp(i, window.chronicle.prop, `${pa}${k}`)})

  e.appendChild(s)
  e.appendChild(i)
  e.appendChild(b)
  e.appendChild(d)
  el.appendChild(e)
}

const renderButton = (cssClass, iconCode) => {
  let e = document.createElement('span')
  e.className = `objButton ${cssClass}`
  let icon = '💾' // add/update
  if (iconCode == 'delete') icon = '➖'
  if (iconCode == 'add') icon = '➕'
  e.innerText = icon
  //e.addAttribute('title', iconCode)
  return e
}

const indentClass = (ind) => {
  if (ind > 0) return `indent_${ind}`
  return ''
}


const listsLocations = () => {
  let ul = elCom('ul', 'setsList')
  for (let s in setsPlans) {
    let li = elCom('li')
    li.innerText = s
    elAel(li, () => { console.log(s) }, 'click')
    ul.appendChild(li)
  }
  return ul
}

const elAel = (el, funk, act) => {
  if (!act) act = 'click'
  el.addEventListener(act, funk)
}

const elCom = (cmp, id) => {
  let el = document.createElement(cmp)
  if (id) el.id = id
  return el
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
