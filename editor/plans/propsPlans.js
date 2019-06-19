const propsPlans = {
default: {
    artist: '',
    desc: '',
    loc: '',
    locs: [],
    pickUp: false,
    isBox: false,
    hit: true, // can hit things with it
    strikes: false, // retaliates
  },
  stick: {
    desc: '🌲 &#1F332; a nice stick',
    locs: ['clearing', 'creepyWoods'],
    artist: 'lucsan',
    pickUp: true,
    actions: {
      // TODO synonyms for pick up? remove, get, take.
      env: {
        kick: () => { propActions().kick('stick') },
      },
      inv: {
        destroy: () => {},
      },
      bod: {
        hit: () => {console.log('you hit');},
        poke: () => {console.log(`you poke`);},
      },
    },
    properties: {
      attack: 2,
      defense: 0,
      weight: 2,
      poking: true,
    },
  },

  chest: {
    desc: 'a locked chest',
    locs: ['testSite', 'clearing'],
    artist: 'lucsan',
    isBox: true,
    actions: {
      env: {
        unlock: () => {propActions().unlock('chest',['chestKey', 'badge'])}
      }
    }
  },

  chestKey: {
    desc: 'key for a chest',
    locs: ['testSite', 'clearing'],
    artist: 'lucsan',
    pickUp: true,
  },

  welcomizer: {
    desc: 'A welcomizer, its here to help',
    locs: ['begining'],
    pickUp: true,
    actions: {
      env: {
        ask: () => { propActions().msg('Click on pickUp to pick me up') }
      },
      bod: {
        ask: () => { propActions().msg('Click on bagit, to put me in the backpack. Click on drop to drop me.') },
      },
    },
  },

  gnome: {
    desc: "a nice gnome",
    locs: ['clearing'],
    actions: {
      env: {
        speak: () => { propActions().msg('ha ha ha, he he he, I\'m a little gnome and you can\'t catch me') },
        tickle: () => {},
      },
    },
  },

  lint: {
    desc: "some grey and fluffy lint",
    locs: ['inv'],
    actions: {
      bod: {
        examine: () => { propActions().msg(`its lint, like you get from your pocket.`) },
        sniff: () => { propActions().msg(`you sniff your lint, it smells vaugly of dust, and pocket.`) },
        throw: () => { propActions().drop('lint') },
      },
    },
  },

  stickyTape: {
    desc: 'a roll of stickytape. Its a tape, which is sticky',
    locs: ['inv'],
    properties: {
      sticking: true,
    },
  },

  lintStick: {
    desc: 'a mysterious lintstick, it has some pocket lint stuck to it. I wonder what this is for?',
    pickUp: true,
    actions: {
      inv: {
        give: () => console.log(`give to gnome`),
        tickling: () => console.log(`You tickle something with it`),
        poking: () => console.log(`you poke something with it`),
      },
    },
    properties: {
      attack: 2,
      defense: 0,
      health: 10,
    },
    combines: {
      needs: ['stick', 'lint', 'stickyTape'],
      destroys: ['stick', 'lint'],
      desc: 'you use a piece of sticky tape to adhere the lint to your stick. Yay, a lintstick, its more stick than lint and it has a sticky linty end',
    },
  },

  penny: {
    desc: 'A shinny penny.'
  },

  badge: {
    desc: 'A little copper button badge, it says `Adventurer #1`.',
    locs: ['bod'],
    pickUp: true,
    actions: {
      bod: {
        rub: () => { propActions().msg('you give it a little rub and its a tiny bit more shinny') },
      }
    },
  },

  littleMonster: {
    desc: 'Oooh how cute, a little monster',
    locs: ['creepyWoods'],
    actions: {
      env: {
        //hit: () => console.log(`monster is hit`)
      },
    },
    strikes: true, // can retaliate
    properties: {
      attack: 3,
      defense: 2,
      health: 4,
      drops: ['penny'],
    },
  },

  mingVase: {
    desc: 'a ming dynsaty delicate china vase',
    locs: ['testSite', 'creepyWoods'],
    actions: {
      env: {
        pickUp: () => propActions().pickUp('stick'),
      },
    },
  },

  washingSoda: {
    desc: 'A tin of sodium carbonate.',
    locs: ['testSite', 'lab'],
  },
  citricAcid: {
    desc: 'a bag of citric acid.',
    locs: ['testSite', 'lab'],
  },
  testTube: {
    desc: 'a test tube of dubious cleanliness.',
    locs: ['testSite', 'lab'],
  },
  chiborg: {
    desc: 'a chicken with a mechanical heart.',
    locs: ['testSite'],
  },
  roboken: {
    desc: 'a robot with a chickens heart.',
    locs: ['testSite', 'begining']
  },
  vexedSheep: {
    desc: 'a slightly vexed sheep with fluffy white fleece.',
    locs: ['testSite', 'funkyHills']
  },
  articulatedGoat: {
    desc: 'a goat, articulated at the knees.',
    locs: ['testSite']
  },
  oldMonk: {
    desc: 'a calm old monk called Ren-i quietly pushing his broom.',
    locs: ['teaHouse']
  }

}
