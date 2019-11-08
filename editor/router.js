const url = require('url')
const fs = require('fs')
const config = require('./config.js').config()

// global.chronicle = {}
// global.chronicle.save = 'null'

const router = (responder, path) => {
  let filepath, mtype //, content
  let lio = path.lastIndexOf('.')
  let ext = (lio > -1) ? path.slice(lio + 1, path.length) : ''
  mtype = 'text/html'
  filepath = (path == '/') ? `/${config.index}` : path
  if (ext == 'js') mtype = 'text/javascript'
  if (ext == 'css') mtype = 'text/css'
  if (ext !== '') return [filepath, mtype]

  if (path.indexOf('/list') > -1) {
    
    if (path.indexOf('/props') < 0 && path.indexOf('/sets') < 0) filepath = '/public/listPlans.html'
    if (path.indexOf('/props') > -1) filepath = '/public/editProps.html'
    if (path.indexOf('/sets') > -1) filepath = '/public/editSets.html'
    if (path.indexOf('/prose') > -1) filepath = '/public/editProse.html'
  }

  if (path.indexOf('/save') > -1) { // or delete or update
    return [null, null] 
  }

  fs.readFile(`${config.root}${filepath}`,  (err, page) => {
    if (err && err.code == 'ENOENT') console.log(err)
    if (page) {
      parser(page.toString(), responder, mtype, path)
    } else {
      responder(`Asset Not found: ${config.root}${filepath}`, mtype)
    }
  })
  return [null, null]
}

const parser = (content, responder, mtype, path) => {
  let prop, set
  prop = ''
  if (path.indexOf('/props/') > -1) {
    prop = path.slice(path.indexOf('/props/') + 7, path.length)
  }
  if (content.indexOf('{{ prop }}') > -1) content = content.replace('{{ prop }}', prop)
  if (content.indexOf('{{ menu }}') > -1) content = content.replace('{{ menu }}', menu())

  responder(content, mtype)

}

const menu = () => {
  const m = fs.readFileSync(`${__dirname}/public/menu.html`)
  return m.toString()
}

const server = (request, responder) => {

  let pathname = url.parse(request.url).pathname
  let [filepath, mtype] = router(responder, pathname)
  if (filepath === null) return

  fs.readFile(`${config.root}${filepath}`,  (err, page) => {
    if (err && err.code == 'ENOENT') {
      console.log(err)
    }
    responder(page, mtype)
  })
}

exports.server = server