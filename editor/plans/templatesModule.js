const prop = () => {
  return {
    artist: '',
    desc: '',
    locs: [],
    pickUp: false,
    Boxes: false,
    reveals: [],
    hit: true,
    strikes: false,
    actions: {
      env: {},
      inv: {},
      bod: {},
    },
    box: {
      key: '',
    },
    combines: {
      needs: [],
      destroys: [],
      desc: '',
    },
    pays: {
      criteria: { list: [], inOrder: false },
      drops: [],
      action: '',
      paid: 0,
      max: 0,
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

const set = () => {
  return {
    designer: '',    
    desc: '',
    proseScript: '',
    label: '',
    hidden: false,
    exits: { 
      setCode: { 
        desc: '',
        door: '',
        locked: false,
        key: '',
        hidden: false,
        reveal: '',
      },
    },
  }
}

exports.all = () => { return { prop, set } }
exports.prop = prop
exports.set = set