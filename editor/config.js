
const config = () => {
  return {
    port: '8888',
    root: 'editor',
    index: 'public/editor.html',
    autoLoad: false,
    source: {
      propsPlans: 'editor/plans/propsStub1.js',
      setsPlans: '',
    },
    target: {
      propsPlans: 'editor/plans/propsStub1.js',
      setsPlans: '',
    },
  }

  // return {
  //   defaultProps: 'editor/plans/propsPlans.js',
  //   defaultSets: 'editor/plans/SetsPlans.js'
  // }
}

exports.config = config
