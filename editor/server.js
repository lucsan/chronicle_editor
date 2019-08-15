const http = require('http')
const url = require('url')
//const qs = require('querystring')
const fs = require('fs')
const svt = require('./servitor.js')
const config = require('./config.js').config()

global.chronicle = {}
global.chronicle.save = 'null'

const responder = (response, content, mimeType) => {
  response.writeHead(200, { 'Content-Type': `${mimeType};charset=utf-8` })
  if (content) {
    response.write(content)
  } else {
    response.write('Responder Error')
  }
  response.end()
}

const router = (response, path) => {
  let filepath, mtype//, content
  let lio = path.lastIndexOf('.')
  let ext = (lio > -1) ? path.slice(lio + 1, path.length) : ''
  mtype = 'text/html'
  filepath = (path == '/') ? `/${config.index}` : path
  if (ext == 'js') mtype = 'text/javascript'
  if (ext == 'css') mtype = 'text/css'
  if (ext !== '') return [filepath, mtype]

  if (path.indexOf('/list') > -1) {
    
    if (path.indexOf('/props') < 0 && path.indexOf('/sets') < 0) filepath = '/public/listPlans.html'
    if (path.indexOf('/props') > -1) filepath = '/public/editPlans.html'
    if (path.indexOf('/sets') > -1) filepath = '/public/editPlans.html'
  }

  if (path.indexOf('/save') > -1) { // or delete or update
    return [null, null] 
    // if (path.indexOf('/prop') > -1) {
    //   // console.log('golbal.save', global.chronicle.save)
    //   // console.log('router')
      
    //   // responder(response, global.chronicle.save, 'text/html')
    //   // global.chronicle.save = 'null'
    //   return [null, null] 
    // }
    // //if (path.indexOf('/prop') > -1) filepath = '/public/test.html'
    // if (path.indexOf('/set') > -1) filepath = '/public/test.html'
    // if (path.indexOf('/props') > -1) filepath = '/public/test.html'
    // if (path.indexOf('/sets') > -1) filepath = '/public/test.html'
  }

  fs.readFile(`${config.root}${filepath}`,  (err, page) => {
    if (err && err.code == 'ENOENT') console.log(err)
    if (page) {
      parser(page.toString(), response, mtype, path)
    } else {
      responder(response, `Asset Not found: ${config.root}${filepath}`, mtype)
    }

  })
  return [null, null]
}

const pathMaker = () => {

}

const parser = (content, response, mtype, path) => {
  let prop, set
  prop = ''
  if (path.indexOf('/props/') > -1) {
    prop = path.slice(path.indexOf('/props/') + 7, path.length)
  }
  if (content.indexOf('{{ prop }}') > -1) content = content.replace('{{ prop }}', prop)
  if (content.indexOf('{{ menu }}') > -1) content = content.replace('{{ menu }}', menu())




  responder(response, content, mtype)

}

const menu = () => {
  const m = fs.readFileSync(`${__dirname}/public/menu.html`)
  return m.toString()
}

const server = (request, response) => {
  let pathname = url.parse(request.url).pathname
  let [filepath, mtype] = router(response, pathname)
  if (filepath === null) return

  fs.readFile(`${config.root}${filepath}`,  (err, page) => {
    if (err && err.code == 'ENOENT') {
      console.log(err)
    }
    responder(response, page, mtype)
  })
}

function start () {
  http.createServer(onRequest).listen(config.port)
  function onRequest(request, response) {
    request.on('error', function(err){ console.log('err ', err) })

    request.on('data', function(data){
      console.log('requestOn:data')
      
      //request.post = JSON.parse(data.toString())
      svt.main(JSON.parse(data.toString()), responder, response)
    })

    server(request, response)
  }
}

exports.start = start

start()

// 📝 THe Following code is configured for win10 default browser.
if (config.autoLoad) require('child_process').exec(`start http://localhost:${config.port}`)

console.log(`Server running @ http://localhost:${config.port}, Auto browser loading: ${config.autoLoad}`)
