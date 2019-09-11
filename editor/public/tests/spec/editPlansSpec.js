describe('editPans ', () => {

  it('should make an address for a new item (prop or set), from a value', () => {
    const data = {
      act: 'add',
      set: 'new',
      value: 'aNewSet'
    }
    const cmds = makeAnAddress(data)
    expect(cmds.address).toEqual(data.value)
  })

  it('should make an address for an existing item new attribute', () => {
    const data = {
      act: 'add',
      set: 'someSet',
      value: 'aNewAttrib'
    }
    const cmds = makeAnAddress(data)
    expect(cmds.address).toBe(data.value)
  })

  it('should update and existing item attribute', () => {
    const data = {
      act: 'update',
      set: 'someSet',
      address: 'one.two',
      value: 'updatedValue'
    }
    const cmds = makeAnAddress(data)
    expect(cmds.address).toBe(data.address)
  })

  it('should prep for post values', () => {
    // obj, name, address, indClass (act)
    let e = document.createElement('input')
    e.id = 'testInput'
    e.value = 'updatedValue'
    let b = document.getElementsByClassName('jasmine_html-reporter')[0]
    b.appendChild(e)
    
    const data = {
      act: 'update',
      set: 'someSet',
      address: 'one.two',
      valueElId: 'testInput'
    }
    const cmds = prepServerValues(data)

    console.log(cmds)
    
    expect(cmds.value).toBe('updatedValue')
  })

  // // Server requires: act, set or prop, [address], [value]
  // const prepServerValues = (data = {}) => {
  //   data.value = document.getElementById(data.valueElId).value
  //   delete(data.valueElId)
  //   let values = makeAnAddress(data)
  //   return values
  // }

  // // if only value then value = address of new item

  // const makeAnAddress = (data = {}) => {
  //   if (!data.address) {
  //     if (data.value) data.address = data.value
  //   }
  //   return data
  // }
  
})