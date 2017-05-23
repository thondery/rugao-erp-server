import Promise from 'bluebird'
import objectid from 'objectid'
import path from 'path'
import fs from 'fs-extra'
import config from '../config'
import * as partProxy from './part'
import { CODE, ErrorInfo, CustomError } from '../error'

const dataDir = path.resolve(config.data, 'species.db')

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

export function getListSync () {
  return getList()
    .then(async (ret) => {
      for (let e of ret) {
        let parts = await partProxy.find({ species: e.sid })
        e.counts = parts.length
      }
      return ret
    })
}

export function find (query = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      resolve(_.filter(listData, query))
    } catch (error) {
      reject(error)
    }
  })
}

export function findOne (query, collection = null, field = 'species') {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      const findData = _.find(listData, query)
      if (collection) {
        collection = {
          ...collection,
          [field]: findData
        }
      }
      resolve(collection)
    } catch (error) {
      reject(error)
    }
  })
}

export function create (name) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      const isTrue = _.find(listData, { name })
      if (isTrue) throw ErrorInfo(CODE.ERROR_SPECIESNAME_UNIQUE)
      listData.push({
        sid   : objectid(),
        name  : name
      })
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { name }))
    } catch (error) {
      reject(error)
    }
  })
}

export function update (sid, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      if (info.name) {
        _.find(listData, o => {
          const isTrue = o.sid !== sid && o.name === info.name
          if (isTrue) throw ErrorInfo(CODE.ERROR_SPECIESNAME_UNIQUE)
        })
      }
      for (let e of listData) {
        if (e.sid === sid) {
          e.name = info.name || e.name
        }
      }
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { sid }))
    } catch (error) {
      reject(error)
    }
  })
}

export function remove (sids) {
  sids = _.isString(sids) && [sids]
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      _.remove(listData, o => sids.indexOf(o.sid) > -1)
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(listData)
    } catch (error) {
      reject(error)
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