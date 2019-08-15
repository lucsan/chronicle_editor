const prop = () => {
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

const set = () => {
  return {
    desc: '',
    proseScript: '',
    label: '',
    designer: '',
    exits: [{ to: '', desc: '', actions: {} }],
  }
}

const box = () => {
  desc: ''
}

const all = () => { return { plan: plan, set: set } }

exports.all = all
exports.plan = plan
exports.set = set
