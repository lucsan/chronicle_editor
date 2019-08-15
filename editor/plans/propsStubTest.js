const propsPlans = {
  default: {
    artist: '',
    desc: '',
    loc: '',
    locs: [''],
    pickUp: false,
    hit: true,
    strikes: false,
  },

  stick: {
    desc: '🌲 &#1F332; a nice stick',
    locs: ['clearing','creepyWoods'],
    artist: 'lucsan',
    actions: {
      env: {
      },
      inv: {
        bosh: 'do boshings',
      },
      bod: {
        hit: () => {console.log('you hit') },
        poke: () => {console.log(`you poke`) },
      },
      gut: {
      },
    },
    properties: {
      attack: 2,
      defense: 0,
      weight: 2,
      poking: true,
    },
  },

  gnome: {
    desc: 'a nice gnome',
    locs: ['clearing','brewery','toilet'],
    actions: {
      env: {
        speak: () => { actions().msg('ha ha ha, he he he, I\'m a little gnome and you can\'t catch me') },
        tickle: () => {},
      },
    },
  },

  washingSoda: {
    desc: 'A tin of sodium carbonate.',
    locs: ['testSite','lab'],
  },

}