const propsPlans = {
  demo: {
    desc: '🌲 &#1F332; a nice demo',
    locs: ['clearing','creepyWoods'],
    artist: 'lucsan',
    pickUp: true,
    actions: {
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
      gut: {
      },
    },
  },

  test: {

  },

}