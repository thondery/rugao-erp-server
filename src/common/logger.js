import config from '../config'
import path from 'path'
import log4js from 'log4js'
import { existsSync, mkdirSync } from 'fs'

const logPath = path.resolve(process.cwd(), config.logger.path)

if (!existsSync(logPath)) {
  mkdirSync(logPath)
}

log4js.configure({
  appenders: [
    {
      type: 'console'
    },
    {
      type: 'file',
      filename: path.resolve(logPath, config.logger.filename),
      maxLogSize: config.logger.maxlogsize * 1024,
      backups: 3,
      category: config.logger.category
    }
  ],
  replaceConsole: true
})

const logger = log4js.getLogger(config.logger.category)
logger.setLevel('INFO')

export default logger