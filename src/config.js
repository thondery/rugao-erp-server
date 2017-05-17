import fs from 'fs'
import path from 'path'

const ENV_DEVELOPMENT = 'development'
const ENV_PRODUCTION  = 'production'
const ENV_TESTING     = 'test'

if (!fs.existsSync(path.resolve(__dirname, 'config.production.js'))) {
  let confStr = fs.readFileSync(path.resolve(__dirname, 'config.development.js'), 'utf-8')
  fs.writeFileSync(path.resolve(__dirname, 'config.production.js'), confStr, { encoding: 'utf-8' })
}

const config = {
  [ENV_PRODUCTION]    : require('./config.production'),
  [ENV_DEVELOPMENT]   : require('./config.development'),
  [ENV_TESTING]       : require('./config.test'),
}

function getConfig () {
  return config[process.env.NODE_ENV] || require('./config.development')
}

export default getConfig().default