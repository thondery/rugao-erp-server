import express from 'express'
import log4js from 'log4js'
import swig from 'swig'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import compress from 'compression'
import errorhandler from 'errorhandler'
import cors from 'cors'
import http from 'http'
import path from 'path'
import fs from 'fs'

import config from './config'
import logger from './common/logger'
import { res_api } from './common/tools'

const app = express()
const staticDir = path.resolve(process.cwd(), 'public')
const routerDir = path.resolve(__dirname, 'routers')
const viewsDir  = path.resolve(process.cwd(), 'views')

if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir)
}

app.set('views', viewsDir)
app.set('view engine', 'html')
app.engine('.html', swig.renderFile)
app.set('view cache', false)
swig.setDefaults({ cache: false })

app.use(bodyParser.json({ limit: '1mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }))
app.use(methodOverride())

app.use(res_api)
app.use(compress())

app.use(express.static(staticDir))

const routerFiles = fs.readdirSync(routerDir)
routerFiles.map( file => {
  if (/\.js$/.test(file)) {
    try {
      fs.readFileSync(path.resolve(routerDir, file))
      let _url = file.replace(/\.js$/i, '').replace(/\_/g, '/')
      if (_url === 'default') {
        app.use(`/`, cors(), require(`./routers/${file}`).default)
      }
      else {
        app.use(`/${_url}`, cors(), require(`./routers/${file}`).default)
      }
    } catch (error) {
      
    }
  }
})

app.use('*', (req, res) => {
  logger.error('status:404; url:', req.originalUrl)
  return res.status(404).render('404')
})

if (config.debug) {
  app.use(errorhandler())
}
else {
  app.use( (err, req, res, next) => {
    logger.error('server 500 error: ', err)
    return res.status(500).render('500')
  })
}

const server = http.createServer(app)
const { host, port } = config
server.listen(port, host, () => {
  logger.info(`Your App Run on http://${host}:${port}`)
})

export default app

