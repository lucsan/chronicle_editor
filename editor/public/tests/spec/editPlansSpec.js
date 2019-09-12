describe('editPans', () => {

  describe('Make an address', () => {

    it('for a new item from a provided value', () => {
      const value = 'aNewSet'
      const data = {
        act: 'add',
        set: 'new',
        value
      }
      const cmds = makeAnAddress(data)
      expect(cmds.address).toEqual(value)
    })

    it('for an existing item new attribute', () => {
      const value = 'aNewAttrib'
      const data = {
        act: 'add',
        set: 'someSet',
        value
      }
      const cmds = makeAnAddress(data)
      expect(cmds.address).toBe(value)
    })

    it('should update an existing item attribute', () => {
      const value = 'updatedValue'
      const data = {
        act: 'update',
        set: 'someSet',
        address: 'one.two',
        value
      }
      const cmds = makeAnAddress(data)
      expect(cmds.address).toBe(data.address)
    })

    it('for an add act with an existing address and a value', () => {
      const value = 'newValue'
      const address = 'one.two'
      const data = {
        act: 'add',
        set: 'someSet',
        address,
        value
      }
      makeAnAddress(data)
      expect(data.address).toEqual(`${address}.${value}`)

    })

    it('should delete an existing attribute', () => {
      const address = 'one.two'
      const data = {
        act: 'delete',
        set: 'someSet',
        address
      }
      makeAnAddress(data)
      console.log(data)
      
      expect(data.address).toEqual(`${address}.${value}`)
      
    })

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

    //console.log(cmds)
    
    expect(cmds.value).toBe('updatedValue')
    e.parentNode.removeChild(e)
  })

  xit('should make a new item', () => {
    const el = addNewAttribute('prop', 'test')
    console.log(el)
    
    expect(1).toBe(2)
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