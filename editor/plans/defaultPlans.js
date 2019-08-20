const defaultProp = () => {
  return {
    artist: '',
    desc: '',
    loc: '',
    locs: [],
    pickUp: false,
    hit: true,
    strikes: false,
    actions: {
      env: {},
      inv: {},
      bod: {},
    },
    box: {},
    boxs: [],
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
    exits: [{ to: '', desc: '', actions: {} }],
  }
}

const defaultBox = () => {
  desc: ''
}

const defaultAll = () => { return { plan: plan, set: set, box: box } }
