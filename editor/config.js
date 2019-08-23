
const config = () => {
  return {
    port: '8888',
    root: 'editor',
    index: 'public/editor.html',
    autoLoad: false,

    plans: {
      props: {
        target: 'editor/plans/propsStub1.js',
        source: 'editor/plans/propsStub1.js' 
      },
      sets: {}
    }
  }


    // propsPlans: {
    //   use: {
    //     target: '',
    //     source: ''        
    //   },
    //   work: {
    //     target: 'editor/plans/propsStub1.js',
    //     source: 'editor/plans/propsStub1.js'        
    //   },
    //   test: {
    //     target: 'editor/plans/testProps.js',
    //     source: 'editor/plans/testProps.js'        
    //   },
    // },
    // setsPlans: {}  

  // return {
  //   defaultProps: 'editor/plans/propsPlans.js',
  //   defaultSets: 'editor/plans/SetsPlans.js'
  // }
}

exports.config = config
