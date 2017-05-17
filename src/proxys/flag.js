import Promise from 'bluebird'
import path from 'path'
import fs from 'fs-extra'
import config from '../config'

const dataDir = path.resolve(process.cwd(), config.data, 'flag.db')

export function getList () {
  return new Promise( (resolve, reject) => {
    try {
      const list = fs.readJSONSync(dataDir)
      resolve(list)
    } catch (error) {
      resolve([])
    }
  })
}

export function setData (data) {
  return new Promise( (resolve, reject) => {
    try {
      fs.writeJSONSync(dataDir, data, { spaces: 2 })
      resolve(data)
    } catch (error) {
      resolve([])
    }
  })
}

export function clear () {
  return new Promise(async (resolve, reject) => {
    try {
      fs.removeSync(dataDir)
      resolve(null)
    } catch (error) {
      reject(error)
    }
  })
}