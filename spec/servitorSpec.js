describe('servitor', () => {

  const svt = require('../editor/servitor.js')
  const fs = require('fs')
  const config = require('../editor/config.js').config()

  const response = {
    write: (content) => { console.log(`Test write: ${content}`) },
    writeHead: (code, header) => { console.log(`Test response: ${code} ${header}`) },
    end: () => { console.log('Test response: end') }
  }

  const tObj = {
    prop: 'mingVase',
    prime: 'actions',
    mingVase: {
      actions: {
        bounce: {}
      }
    },
    pinkPonk: {
      properties: {
        fibble: {
          leron: {}
        },
        gark: ['blarf'],
      }
    }
  }

  const testPlan = {
    test_item: {
      str: 'A string',
      num: 111,
      boo: false,
      obj: {
        oStr: 'string in obj',
        oNum: 222,
        oBoo: true,
        oArr: [{ obj1: 'thing' }, { obj2: 'thung' }],
        oObj: { 
          oObj1: () => {},
        }
      },
      arr: [],
      arr1: ['aaaa', 'bbbb']

    },
    test_item_2: {}

  }
 
  let gpp = global.plans.props
  let gps = global.plans.sets

  const respond = (response) => {
    return (content, mime) => {
      console.log(`Test Responds: ${content}`)
    }
  }

  const responder = respond(response)

  beforeAll(() => {
    // console.log('before all')
    // fs.unlinkSync(config.propsPlans.test.source)
    // fs.writeFileSync(config.propsPlans.test.source, 'const propsPlans = {}')

  })

  afterAll(() => {
    // console.log('after all')
    
  })

  describe('Plans to string walker', () => {

    it('should walk plans and return a string', () => {
      let pw = svt.main({
        test: true,
      }).plansToStringWalker(testPlan)

      //console.log(pw)
      const item = pw.substring(0, 10)
      expect(item).toBe('\ttest_item')
    })

  })

  describe('updateSelector', () => {

    it('should select a new prop', () => {
      let res = svt.main({ test: true }).updateSelector({
        act: 'add',
        prop: 'new',
        address: 'newItem'
        
      })      
      expect(res).toEqual({ act: 'added', prop: 'newItem' })
    })

    it('should select a new attribute', () => {
      let res = svt.main({ test: true }).updateSelector({
        act: 'add',
        prop: 'test',
        address: 'test.attr'
        
      })
      expect(res).toEqual({ act: 'updatedAttribute', prop: 'test', address: 'test.attr', value: {} })
    })

    it('should update an existing attribute', () => {
      let res = svt.main({ test: true }).updateSelector({
        act: 'update',
        prop: 'test',
        address: 'test.attr',
        value: 'newValue'
      })
      expect(res).toEqual({ act: 'updatedAttribute', prop: 'test', address: 'test.attr', value: 'newValue' }) 
    })

    it('should delete an attribute', () => {
      let res = svt.main({ test: true }).updateSelector({
        act: 'delete',
        prop: 'test',
        address: 'test.attr'
      })      
      expect(res).toEqual({ act: 'deletedAttribute', prop: 'test', address: 'test.attr' }) 
    })

    it('should delete an item', () => {
      gpp.testDeleteItem = {}
      gpp.testDeleteItem.planko = 'test'
      let res = svt.main({ test: true }).updateSelector({
        act: 'delete',
        prop: 'testDeleteItem'
      })      
      expect(res).toEqual({ act: 'deletedItem', prop: 'testDeleteItem' }) 
    })    



  })

  describe('Main updates plans', () => {

    it('should make a new prop', () => {
      svt.main(
        {
          test: true, 
          act: 'add',
          prop: 'new',
          address: 'newItem'
        }, 
        responder, 
      )
      expect(typeof gpp.newItem).toBe('object')
    })   
    
    it('should add attribute to prop', () => {
      svt.main({
        test: true,
        act: 'add',
        prop: 'newItem',
        address: 'test.attr',      
      }, responder)

      expect(typeof gpp.newItem.test.attr).toBe('object')

    })
  })



  it('should update a attribute value', () => {

    svt.main(
      { 
        test: true, 
        act: 'update',
        prop: 'test',
        address: 'test.attr',
        value: 'newValue'
      }, 
      responder
    )
    expect(gpp.test.test.attr).toBe('newValue')
  })


  it('should update an existing attribute value', () => {
    svt.main(
      { 
        test: true, 
        act: 'update',
        prop: 'test',
        address: 'test.attr',
        value: 18
      }, 
      responder
    )
    expect(gpp.test.test.attr).toBe(18)
  })

  it('should delete a attribute', () => {
    svt.main(
      {
        test: true,
        act: 'delete',
        prop: 'test',
        address: 'test.attr'
      },
      responder
    )
    expect(gpp.test.test.attr).toBe(undefined)
  })

  it('should delete a prop', () => {
    gpp.pinkPonk = tObj.pinkPonk
    svt.main(
      {
        test: true,
        act: 'delete',
        prop: 'pinkPonk'
      },
      responder
    )   
    expect(typeof gpp.pinkPonk).toBe('undefined')
  })


  // xit('should write a browser js config file (ie: common config)', () => {
  //   svt.main({ test: true, act: 'createBrowserConfig' })
  //   // svt.main({ test: true, act: 'test' }).createBrowserConfig()
  //   expect(2).toBe(2)
  //   expect(2).toBe(2)
  // })

  // xit('should create editable plans', () => {
  //   svt.main({ test: true, act: 'createEditPlans' })
  //   // svt.main({ test: true, act: 'test' }).createEditPlans()

    
  //   expect(1).toBe(2)
  // })


})

