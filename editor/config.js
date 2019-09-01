const config = () => {
  return {
    port: '8888',
    root: 'editor',
    public: 'public',
    index: 'public/editor.html',
    autoLoad: false,

    plans: {
      props: {
        target: 'editor/plans/propsPlans.js',
        source: 'editor/plans/propsPlans.js',
        temp: 'editor/plans/propsTemp.js'
      },
      sets: {
        target: 'editor/plans/setsPlans.js',
        source: 'editor/plans/setsPlans.js',     
        temp: 'editor/plans/setsTemp.js'     
      }
    }
  }

}

exports.config = config
