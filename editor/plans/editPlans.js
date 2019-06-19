window.onload = () => edit()

const editProp = (name) => {

  console.log(name)
}


const edit = () => {
  console.log(propsPlans)
  console.log('prop', prop)
  let output = document.getElementById('output')
  renderPropsList(output)

  if (prop != '' && prop != '{{ prop }}') {
    //saveButton(output)
    let e = document.createElement('div')
    e.id = 'props'
    e.className = 'propsEdit'
    const fullPlan = addsDefaults(propsPlans[prop])
    const htmlAttrs = walks(fullPlan, e)
    output.appendChild(htmlAttrs)
    //renderAtrtributesList(prop, htmlAttrs, output)

  }

}

const renderAtrtributesList = (prop, attrs, output) => {
  let e = document.createElement('div')
  e.classList.add('attribs')
  e.innerHTML = `<div id="props" ><div class="title" >${prop}</div>${attrs}</div>`
  output.appendChild(e)
}

const renderPropsList = (output) => {
  const p = procPropsNames(propsPlans)
  let a = document.createElement('div')
  a.classList = 'thingsList'
  a.innerHTML = `<div>${p}</div>`
  output.appendChild(a)
}

// const saveButton = (output) => {
//   let sb = document.createElement('div')
//   sb.id = 'save'
//   sb.className = 'save'
//   sb.innerHTML = 'Save'
//   output.appendChild(sb)
// }

const addsDefaults = (targetProp) => {
  const dp = defaultProp()
  for (let i in dp) {
    if (!targetProp[i]) {
      targetProp[i] = dp[i]
    }
  }
  return targetProp
}

const walks = (object, el) => {
  let e = document.createElement('div')

  const walk = (obj, e, ind, pa) => {
    let indClass = indentClass(ind)
    for (let k in obj) {

      if (typeof(obj[k]) == 'object' && !Array.isArray(obj[k])) {
        let e = document.createElement('div')
        e.id = `${pa}${k}`
        e.dataset.pa = pa
        //e.classList.add('attrb', `${indClass}`)
        e.className = `attrb ${indClass}`
        let s = document.createElement('span')
        s.innerText = k
        s.className = `${indClass}`        
        s.addEventListener('click', () => { editProp(`${pa}${k}`)})
        e.appendChild(s)
        el.appendChild(e)
        //h += `<div id="${pa}${k}" class="attrb ${indClass}" data-pa="${pa}" >
        //<span onclick="editProp('${pa}${k}')" class="${indClass}">${k}</span>`

        walk(obj[k], e, ++ind, pa += `${k}.`)
        --ind
        pa = pa.replace(`${k}.`, '')
      } else {
        let e = document.createElement('div')
        e.className = `attrb ${indClass}`
        e.dataset.pa = pa


        let i = document.createElement('input')
        i.id = `${pa}${k}`
        i.value = obj[k]
        i.setAttribute('type', 'text')
        // e.name = k
        // e.type = 'textArea'

        let s = document.createElement('span')
        s.innerText = k
        s.addEventListener('click', () => {editProp(`${pa}${k}`)})


        e.appendChild(s)
        e.appendChild(i)
        el.appendChild(e)
        //h += `<div id="${k}" class="attrb ${indClass}" data-pa="${pa}" >
        //<span onclick="editProp('${pa}${k}')" >${k}</span>
        //<input type="text" name="${k}" value="${obj[k]}" /></div>`


      }
    }

  }
  walk(object, e, 0, '')

  return el
}

// const walks = (object) => {
//   let a = {}
//   let h = ''
//   const walk = (obj, a, ind, pa) => {
//     let indClass = indentClass(ind)
//     for (let k in obj) {
//
//       if (typeof(obj[k]) == 'object' && !Array.isArray(obj[k])) {
//
//         h += `<div id="${pa}${k}" class="attrb ${indClass}" data-pa="${pa}" ><span onclick="editProp('${pa}${k}')" class="${indClass}">${k}</span>`
//         a[k] = {}
//         walk(obj[k], a[k], ++ind, pa += `${k}.`)
//         --ind
//         pa = pa.replace(`${k}.`, '')
//       } else {
//         h += `<div id="${k}" class="attrb ${indClass}" data-pa="${pa}" ><span onclick="editProp('${pa}${k}')" >${k}</span><input type="text" name="${k}" value="${obj[k]}" /></div>`
//
//         a[k] = obj[k].toString()
//       }
//       if (typeof(obj[k]) == 'object' && !Array.isArray(obj[k])) {
//         h += '</div>'
//       }
//     }
//
//   }
//   walk(object, a, 0, '')
//
//   return h
// }

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
