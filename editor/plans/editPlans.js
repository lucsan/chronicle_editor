'strict'
window.onload = () => edit()

const edit = () => {
  console.log(propsPlans)
  console.log('prop', prop)
  let output = document.getElementById('output')

  let locList = listsLocations()
  output.appendChild(locList)

  ajax()

  renderPropsList(output)

  if (prop != '' && prop != '{{ prop }}') {
    let e = document.createElement('div')
    e.id = 'props'
    e.className = 'propsEdit'
    const fullPlan = addsDefaults(propsPlans[prop])
    const metaData = infersMetaData(fullPlan)
    const htmlAttrs = walks(fullPlan, e)
    output.appendChild(htmlAttrs)

    // Test debug call
    updateProp('actions.bod.poke', 'ts')

  }
}

const renderPropsList = (output) => {
  const p = procPropsNames(propsPlans)
  let a = document.createElement('div')
  a.classList = 'thingsList'
  a.innerHTML = `<div>${p}</div>`
  output.appendChild(a)
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

const infersMetaData = (data) => {
  console.log(data)
  let a = {}
  const walk = (obj, a) => {
    for (let k in obj) {
      if (typeof(obj[k]) == 'object') {
        console.log(obj[k])
        walk(obj[k])
      } else {
        console.log(obj[k])
      }
    }
  }

  walk(data, a)
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

const addAttribute = () => {
  console.log('addAttribute')
}


const nameLevelElement = (el, k, pa, indClass) => {
  let e = document.createElement('div')
  e.id = `${pa}${k}`
  e.dataset.pa = pa
  e.dataset.ty = 'ob'
  e.className = `attrb obj ${indClass}`

  let s = document.createElement('span')
  s.innerText = k
  s.className = `title ${indClass}`
  s.addEventListener('click', () => { addAttribute(`${pa}${k}`, 'ob')})

  let b = document.createElement('span')
  b.className = `objButton ${pa}${k}`
  b.innerText = '➕'
  b.addEventListener('click', () => {addAttribute(`${pa}${k}`, 'ob')})

  e.appendChild(s)
  e.appendChild(b)
  el.appendChild(e)
}

const updateProp = (el, address, typ) => {
  let p = Function(`return propsPlans.${prop}.${address}`)()
  console.log('updateProp', p, el.value)
}

const valueLevelElement = (el, obj, k, pa, indClass) => {
  let e = document.createElement('div')
  e.className = `attrb ${indClass}`
  e.dataset.pa = pa
  e.dataset.ty = 'vl'

  let i = document.createElement('textarea')
  i.id = `${pa}${k}`
  i.value = obj[k]
  i.cols = 100
  i.rows = 1

  let s = document.createElement('span')
  s.innerText = k
  s.className = 'title'
  s.addEventListener('click', () => {updateProp(`${pa}${k}`, 'vl')})

  let b = document.createElement('span')
  b.className = `objButton ${pa}${k}`
  b.innerText = '➖'
  b.innerText = '💾'
  b.addEventListener('click', () => {updateProp(i, `${pa}${k}`, 'v1')})



  e.appendChild(s)
  e.appendChild(i)
  e.appendChild(b)
  el.appendChild(e)
}

const indentClass = (ind) => {
  if (ind > 0) return `indent_${ind}`
  return ''
}

const procPropsNames = (propsPlans) => {
  let s = ''
  for (p in propsPlans) {
    s += `<div><a href="/list/props/${p}">${p}</a></div>`
  }
  return s
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

const ajax = () => {
  let xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    console.log('xhr:', xhr.responseText)
  }
  xhr.open('POST', 'http://localhost:8888/save/prop', true)
  //xhr.open('POST', 'http://localhost:8888/test.html', true)

  xhr.send()
}

// const editProp1 = (address, typ) => {
//   let p = Function(`return propsPlans.${prop}.${address}`)()
//
//   console.log('target', p)
//
//   let output = document.getElementById('props')
//   console.log(address)
//
//   let e = document.createElement('div')
//   e.className = 'editorPanel'
//
//   let d = document.createElement('div')
//   d.classList.add('title')
//   d.innerText = `${address}`
//
//   let i = document.createElement('textarea')
//   //i.type = 'textarea'
//
//   //i.setAttribute('type', 'textArea')
//   i.setAttribute('rows', '4')
//   i.setAttribute('cols', '50')
//   //i.setAttribute('style', 'width: 100px; height: 60px; ')
//   i.value = p
//
//   let s = document.createElement('div')
//
//   e.appendChild(d)
//   e.appendChild(i)
//
//   output.insertBefore(e, output.firstChild)
//
//
//
// //console.log('comp', propsPlans.stick.actions)
//
//
//   console.log(prop, `${name}`, address, typ, p)
//
// }
