const config = () => {
  return {
    port: '8888',
    root: 'editor',
    index: 'public/editor.html',
    autoLoad: false,

    plans: {
      props: {
        target: 'editor/plans/propsBuild.js',
        source: 'editor/plans/propsBuild.js' 
      },
      sets: {}
    }
  }

}

exports.config = config
