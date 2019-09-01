const http = require('http')
const config = require('./config.js').config()
const router = require('./router.js')
const svt = require('./servitor.js')

const respond = (response) => {
  return (content, mimeType) => {
    response.writeHead(200, { 'Content-Type': `${mimeType};charset=utf-8` })
    if (content) {
      response.write(content)
    } else {
      response.write('Responder Error')
    }
    response.end()    
  }
}

function start () {
  svt.main({ act: 'setup' }).setup()
  http.createServer(onRequest).listen(config.port)
  function onRequest(request, response) {
    const responder = respond(response)
    request.on('error', function(err){ console.log('err ', err) })

    request.on('data', function(data){
      console.log('requestOn:data')
      svt.main(JSON.parse(data.toString()), responder, response)
    })
    router.server(request, responder)
  }
}

exports.start = start
exports.respond = respond

start()

// 📝 The Following code is configured for win10 default browser.
if (config.autoLoad) require('child_process').exec(`start http://localhost:${config.port}`)

console.log(`Server running @ http://localhost:${config.port}, Auto browser loading: ${config.autoLoad}`)
