const defaultProp = () => {
  return {
    artist: '',
    desc: '',
    //loc: '',
    locs: [],
    pickUp: false,
    hit: true,
    strikes: false,
    reveals: [],
    boxs: [],    
    actions: {
      env: {},
      inv: {},
      bod: {},
    },
    box: { 
      key: '', 
    },
    pays: {
      criteria: { list: [], inOrder: false },
      drops: [],
      action: '',
      paid: 0,
      max: 0,
    },
    combines: {
      needs: [],
      destroys: [],
      desc: '',
    },    
    properties: {
      attack: 0,
      defense: 0,
      weight: 0,
      poking: true,
      drops: [],
    },
  }
}

const defaultSet = () => {
  return {
    desc: '',
    proseScript: '',
    label: '',
    designer: '',
    exits: { 
      desc: '',
      door: false,
      locked: false,
      key: '',
      hidden: false,
      reveal: ''        
    },
  }
}

const defaultBox = () => {
  desc: ''
}

const defaultAll = () => { return { plan: plan, set: set, box: box } }
