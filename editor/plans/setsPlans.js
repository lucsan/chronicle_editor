const setsPlans = {
  // place {id name}: Description (with tokens)
  demo: {
    desc: 'A demo place',
    //proseScript: 'begining',
    visited: 0,
    exits: [
      {to: 'test', desc: 'Adventure awaits (click here) ...'},
      {
        to: 'test2',
        actions: {
          enter: () => {setActions().enter('testSite')},
          unlock: () => {}
        }
      },
    ]
  },
  test: {

  },

  test2: {
    desc: 'hazardous items test area',
    exits: [
      { to: 'demo' },
    ],
  },
}