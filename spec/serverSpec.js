describe('server', () => {

  const svr = require('../editor/server.js')

  let response = {
    write: (content) => { console.log(`Test write: ${content}`) },
    writeHead: (code, header) => { console.log(`Test response: ${code} ${header}`) },
    end: () => { console.log('Test response: end') }
  }

  it('should have a responder', () => {
    let responder = svr.respond(response)
    // console.log(responder('some content', 'no-mime'))
    
    expect(typeof responder).toBe('function')
  })


})