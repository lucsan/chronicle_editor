const config = () => {
  return {
    port: '8888',
    root: 'editor',
    index: 'public/editor.html',
    autoLoad: false,

    plans: {
      props: {
        target: 'editor/plans/propsStub.js',
        source: 'editor/plans/propsStub.js' 
      },
      sets: {}
    }
  }

}

exports.config = config
