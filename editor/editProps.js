'strict'

if (typeof appTesting == 'undefined') window.onload = () => edit() 

const edit = (prop) => {
  console.log('edit prop', window.chronicle.plans.props)
  console.log(propsPlans)
  
  
  prop = checkCurrentItem('prop', prop)

  let output = document.getElementById('output')
  output.innerHTML = ''

  output.appendChild(elCom('div', { 
    text: 'Harden Props',
    classes: 'harden button',
    func:  () => { harden('props') } 
  } ))

  output.appendChild(listsPlansItems('sets'))
  output.appendChild(listsPlansItems('props', 'edit', addNewItem('Prop')))

  if (typeof window.chronicle.prop == 'undefined') return

  output.appendChild(propOutput(prop))
  output.appendChild(addNewAttribute('prop', prop))

  //console.log(window.chronicle.plans)
  

  const plans = window.chronicle.plans.props[prop]    
  const attribElems = elementsFromPlans(plans, 'prop', prop, elCom('div'))

  let mds = missingDefaults(window.chronicle.plans.props[prop])
  const defaults = elementsFromPlans(mds, 'prop', prop, elCom('div', { id: 'missingDefaults', classes: 'missingDefaults' } ))    

  output.appendChild(attribElems)
  output.appendChild(defaults)
}

const propOutput = (prop) => {
  let el = elCom('div', { id: 'prop' })
  el.appendChild(elCom('div', { text: prop, classes: 'activeItemTitle' }))
  return el
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



// const listsProps = () => {
//   let c = elCom('div', { id: 'thingsList' })
//   c.appendChild(addNewProp())

//   for (const p in window.chronicle.plans.props) {
//     let el = elCom('div', { id: p })
//     el.innerText = p
//     el.className = `button ${p}`
//     elAel(el, () => { edit(p) })
//     c.appendChild(el)
//   }
//   return c
// }

// const addNewProp = () => {
//   let el = elCom('div', { id: 'newProp' })
//   el.innerText = 'New Prop'
//   el.className = 'button'
//   elAel(el, () => { edit('new') })
//   return el
// }

// const addNewAttribute = (prop) => {
//   const id = 'newPropAttribute'
//   let el = elCom('div', {})
//   let t= elCom('textarea', { id: id, classes: 'textareaShort' })
//   // let b = renderButton('add', 'add', () => { updateProp({ act: 'add', valueElId: id }) })
//   let b = renderButton('add', 'add', () => { postServerCommand({ act: 'add', prop, valueElId: id }) })

//   el.appendChild(elCom('span', { text: 'New Attrib' } ))
//   el.appendChild(t)
//   el.appendChild(b)

//   return el
// }
