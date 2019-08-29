const propsPlans = {
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
        hit: () => {console.log('you hit') },
        poke: () => {console.log(`you poke`) },
      },
      gut: {},
    },
  },
  gnome: {
    desc: "a nice gnome",
    locs: ['clearing', 'brewery', 'toilet'],
    actions: {
      env: {
        speak: () => { actions().msg('ha ha ha, he he he, I\'m a little gnome and you can\'t catch me') },
        tickle: () => {},
      },
    },
  },

  washingSoda: {
    desc: 'A tin of sodium carbonate.',
    locs: ['testSite', 'lab'],
  }

}
