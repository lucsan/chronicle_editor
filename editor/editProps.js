'strict'

if (typeof appTesting == 'undefined') window.onload = () => edit() 

const edit = (prop) => {

  let output = document.getElementById('output')
  output.innerHTML = ''

  output.appendChild(elCom('div', { 
    text: 'Harden Props',
    classes: 'harden button',
    func:  () => { harden('props') } 
  } ))

  output.appendChild(listsPlansItems('sets'))
  output.appendChild(listsPlansItems('props', 'edit', addNewItem('Prop')))

  if (prop == 'new') {
    output.appendChild(propOutput(prop))
    output.appendChild(addNewPlan('prop', prop))
  }

  if (typeof propsPlans[prop] == 'undefined') return
 
  const attribElems = elementsFromPlans(propsPlans[prop] , 'prop', prop, elCom('div'))

  let mds = missingDefaults(propsPlans[prop])
  const defaults = elementsFromPlans(mds, 'prop', prop, elCom('div', { id: 'missingDefaults', classes: 'missingDefaults' } ))    

  output.appendChild(attribElems)
  output.appendChild(defaults)
}

const propOutput = (prop) => {
  let el = elCom('div', { id: 'prop' })
  el.appendChild(elCom('div', { text: prop, classes: 'activeItemTitle' }))
  return el
}

const missingDefaults = (targetProp) => {
  let missing = []
  const dp = prop()
  if (targetProp == undefined) return dp  
  for (let i in dp) {
    if (!targetProp[i]) {
      missing[i] = dp[i]
    }
  }
  return missing
}
