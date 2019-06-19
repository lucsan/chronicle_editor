const defaultProp = () => {
  return {
    artist: '',
    desc: '',
    loc: '',
    locs: [],
    pickUp: false,
    isBox: false,
    hit: true,
    strikes: false,
    actions: {
      env: {},
      inv: {},
      bod: {},
    },
    properties: {
      attack: 0,
      defense: 0,
      weight: 0,
      poking: true,
      drops: [],
    },
    combines: {
      needs: [],
      destroys: [],
      desc: '',
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
