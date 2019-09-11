'strict'

window.chronicle = {}
window.chronicle.plans = {}
window.chronicle.plans.props = propsPlans
window.chronicle.plans.sets = setsPlans

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

const elementsFromObjects = (object, el) => {

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

const makeAddress = (data) => {
  let obj = {}

  if (data.address == null || data.address == '' && data.act != 'add') {
    if (data.name == null || data.name == '') {
      obj.address = data.value
      obj.value = {}
      return obj
    }

    return obj
  }

  if (data.act == 'add') {
    obj.address = `${data.name}.${data.value}`
    obj.value = {}
  } else {
    obj.address = data.name
    obj.value = data.value
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