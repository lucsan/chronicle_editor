const config = () => {
  return {
    port: '8888',
    root: 'editor',
    public: 'public',
    plansRoot: 'plans',
    index: 'public/editor.html',
    autoLoad: false,

    plans: {
      props: {
        //target: 'editor/plans/propsPlans.js',
        source: 'editor/plans/hardProps.js',
        temp: 'editor/plans/tempProps.js'
      },
      sets: {
        //target: 'editor/plans/setsPlans.js',
        source: 'editor/plans/hardSets.js',     
        temp: 'editor/plans/tempSets.js'     
      }
    }
  }

}

exports.config = config
