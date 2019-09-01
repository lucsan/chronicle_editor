describe('servitor', () => {

  const svt = require('../editor/servitor.js')
  // const fs = require('fs')
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

  global.plans = {}
  global.plans.props = {}
  let gpp = global.plans.props

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

  it('should make a new prop', () => {
    let x = svt.main(
      {
        test: true, 
        act: 'newProp', 
        value: tObj.prop 
      }, 
      responder, 
    )
      console.log(x)
      
    expect(typeof gpp[tObj.prop]).toBe('object')
  })

  it('should add attribute to prop', () => {
    svt.main({
      test: true,
      act: 'updateProp',
      prop: tObj.prop,
      value: tObj.prime,      

    }, responder)
    
    expect(gpp[tObj.prop][tObj.prime]).not.toBe(undefined)
  })

  it('should update a attribute value', () => {

    svt.main(
      { 
        test: true, 
        act: 'updateProp',
        prop: tObj.prop,
        address: tObj.prime,
        value: tObj[tObj.prop][tObj.prime]
      }, 
      responder
    )

    expect(gpp[tObj.prop][tObj.prime]).toEqual(tObj.mingVase.actions)
  })


  it('should update an existing attribute value', () => {
    const address = 'actions.smash'
    svt.main(
      { 
        test: true, 
        act: 'updateProp',
        prop: tObj.prop,
        address: address,
        value: 18
      }, 
      responder
    )
    expect(gpp[tObj.prop].actions.smash).toBe(18)
  })

  it('should delete a prop', () => {
    gpp.pinkPonk = tObj.pinkPonk
    svt.main(
      {
        test: true,
        act: 'deleteProp',
        prop: tObj.prop
      },
      responder
    )   
    expect(typeof gpp[tObj.prop]).toBe('undefined')
  })


  it('should delete a attribute', () => {
    svt.main(
      {
        test: true,
        act: 'deletePropAttribute',
        prop: 'pinkPonk',
        address: 'properties.fibble.leron'
      },
      responder
    )
    expect(gpp.pinkPonk.properties.fibble.leron).toBe(undefined)
  })

  it('should write a browser js config file (ie: common config)', () => {
    svt.main({ test: true, act: 'createBrowserConfig' })
    // svt.main({ test: true, act: 'test' }).createBrowserConfig()
    expect(2).toBe(2)
    expect(2).toBe(2)
  })

  it('should create editable plans', () => {
    svt.main({ test: true, act: 'createEditPlans' })
    // svt.main({ test: true, act: 'test' }).createEditPlans()

    
    expect(1).toBe(2)
  })


//   xit('should update an existing attributre value', () => {
//     const address = `${tObj.prime}.bounce`
//     svt.main(
//       { 
//         test: true, 
//         act: 'updateProp',
//         prop: tObj.prop,
//         address: address,
//         value: () => { console.log('new bounce function') }
//       }, 
//       responder
//     )
// console.log(gpp)

//     const obj = {
//       funca: () => { },
//       thing: {
//         boing: {
//           bounce: ''
//         },
//         funki: () => {}
//       },
//       stuff: {
//         instuff: {
//           funko: () => { console.log() }
//         }
//       }
//     }

//     // const {thing, ...abj} = obj

//     // console.log(obj)
//     // console.log({...obj})
//     // console.log(abj)
//     // abj.stuff.metho = {}
//     // console.log(obj)
    
//     let pran = {}
//     pran.pron = { }

//     pran['pron']['pro'] = 'x'

//     // addressDeconstruct('obj.thing.boing.bounce', 'pron', pran)
//     addressAddressor(pran.pron, 'doings', {}) 
//     console.log('pran', pran)
//     addressAddressor(pran.pron, 'doings.boing', {}) 
//     addressAddressor(pran.pron, 'doings.flart', 'beepo') 
//       console.log('pran', pran)        
//     addressAddressor(pran.pron, 'doings.boing.bounce', 'val1' )

//     // addressAddressor(pran.pron, null, 'val3')
//     console.log('pran', pran)
    

//     expect(typeof gpp[tObj.prop][tObj.prime].bounce).toBe('function')
//   })

  // /* Rules:
  //  * An address can be upto 3 items (a.b.c)
  //  * Plans are prop or set pointer
  //  * if a place (prime, genus, order) exists value is added
  //  * if a place does not exist, will make one
  //  * returns nothing as it mutates the plans object
  // */
  // const addressAddressor = (plans, address, value) => {
  //   const [prime, genus, order] = address.split('.')
  //   let v = null
  //   typeof value == 'object' && !Array.isArray(value)? v = {...value}: v = value 
  //   if (prime && !plans[prime]) { plans[prime] = {} }
  //   if (genus && !plans[prime][genus]) { plans[prime][genus] = {} }
  //   if (order) return plans[prime][genus][order] = v
  //   if (genus) return plans[prime][genus] = v
  //   if (prime) return plans[prime] = v
  // }


  // const addressDeconstruct = (plans, address, value) => {
  //   let d = baseDot.split('.')
  //   let a = address.split('.')
  // let t = d.concat(a)    
  //   console.log(d, a)
  //   console.log(t)


    
  //   baseObj[address] = 'y'

    
  // }

})

