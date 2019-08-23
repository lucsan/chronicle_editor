describe('router', () => {
  const router = require('../editor/router.js')
  //const url = require('url')

  let response = {
    write: (content) => { console.log(`Test write: ${content}`) },
    writeHead: (code, header) => { console.log(`Test response: ${code} ${header}`) },
    end: () => { console.log('Test response: end') }
  }

  // it('should have a responder', () => {
  //   let responder = router.responder(response)
  //   // console.log(responder('some content', 'no-mime'))
    
  //   expect(typeof responder).toBe('function')
  // })

})