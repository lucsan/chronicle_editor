'strict'

if (typeof appTesting == 'undefined') window.onload = () => edit() 

const edit = (set) => {

  let output = document.getElementById('output')
  output.innerHTML = ''

  output.appendChild(elCom('div', { 
    text: 'Harden Sets',
    classes: 'harden button',
    func:  () => { harden('sets') } 
  } ))

  output.appendChild(listsPlansItems('props'))
  output.appendChild(listsPlansItems('sets', 'edit', addNewItem('Set')))
 
  if (set == 'new') {
    output.appendChild(setOutput(set))
    output.appendChild(addNewPlan('set', set))
  }

  if (typeof setsPlans[set] == 'undefined') return
  
  const attribElems = elementsFromPlans(setsPlans[set], 'set', set, elCom('div'))

  let mds = missingDefaults(window.chronicle.plans.sets[set])
  const defaults = elementsFromPlans(mds, 'set', set, elCom('div', { id: 'missingDefaults', classes: 'missingDefaults' } ))    

  output.appendChild(attribElems)
  output.appendChild(defaults)

}

const setOutput = (set) => {
  let el = elCom('div', { id: 'set' })
  el.appendChild(elCom('div', { text: set, classes: 'activeItemTitle' }))
  return el
}

const missingDefaults = (targetSet) => {
  let missing = []
  const ds = set()
  if (targetSet == undefined) return ds
  for (let i in ds) {
    if (!targetSet[i]) {
      missing[i] = ds[i]
    }
  }
  return missing
}