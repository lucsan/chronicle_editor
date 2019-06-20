const http = require('http')
const url = require('url')
const fs = require('fs')

const config = {
  port: '8888',
  root: 'editor',
  index: 'editor.html',
  autoLoad: false
}

const responder = (response, content, mineType) => {
  response.writeHead(200, { 'Content-Type': `${mineType};charset=utf-8` })
  if (content) {
    response.write(content)
  } else {
    response.write('Responder Error')
  }
  response.end()
}

const router = (response, path) => {
  let filepath, mtype, content

  let lio = path.lastIndexOf('.')
  let ext = (lio > -1) ? path.slice(lio + 1, path.length) : ''
  mtype = 'text/html'
  filepath = (path == '/') ? `/${config.index}` : path
  if (ext == 'js') mtype = 'text/javascript'
  if (ext == 'css') mtype = 'text/css'
  if (ext !== '') return [filepath, mtype]

  if (path.indexOf('/list') > -1) {
    if (path.indexOf('/props') > -1) filepath = '/editPlans.html'
    if (path.indexOf('/sets') > -1) filepath = '/editPlans.html'
  }

  if (path.indexOf('/save') > -1) {
    if (path.indexOf('/prop') > -1) filepath = '/test.html'
    if (path.indexOf('/set') > -1) filepath = '/test.html'
    if (path.indexOf('/props') > -1) filepath = '/test.html'
    if (path.indexOf('/sets') > -1) filepath = '/test.html'
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

const parser = (content, response, mtype, path) => {
  let prop, set
  prop = ''
  if (path.indexOf('/props/') > -1) {
    prop = path.slice(path.indexOf('/props/') + 7, path.length)
  }
  if (content.indexOf('{{ prop }}') > -1) content = content.replace('{{ prop }}', prop)


  responder(response, content, mtype)

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
    server(request, response)
  }
}

exports.start = start

start()

// 📝 THe Following code is configured for win10 default browser.
if (config.autoLoad) require('child_process').exec(`start http://localhost:${config.port}`)

console.log(`Server running @ http://localhost:${config.port}, Auto browser loading: ${config.autoLoad}`)
