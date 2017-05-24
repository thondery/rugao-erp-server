import Promise from 'bluebird'
import objectid from 'objectid'
import uuid from 'uuid'
import path from 'path'
import fs from 'fs-extra'
import config from '../config'
import * as speciesProxy from './species'
import { CODE, ErrorInfo, CustomError } from '../error'

const dataDir = path.resolve(config.data, 'part.db')

export function getList () {
  return new Promise( (resolve, reject) => {
    try {
      const listData = fs.readJSONSync(dataDir)
      resolve(listData)
    } catch (error) {
      resolve([])
    }
  })
}

export function getListSync () {
  return getList()
    .then(async (ret) => {
      const _ret = []
      for (let e of ret) {
        let part = await speciesProxy.findOne({ sid: e.species }, e)
        _ret.push(part)
      }
      return _ret
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

export function create (model, name, species) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      const isTrue = _.find(listData, { model })
      if (isTrue) throw ErrorInfo(CODE.ERROR_PARTMODEL_UNIQUE)
      listData.push({
        _id       : objectid(),
        model     : model,
        name      : name,
        counts    : 0,
        species   : species
      })
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { model }))
    } catch (error) {
      reject(error)
    }
  })
}

export function update (_id, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      if (info.username) {
        _.find(listData, o => {
          const isTrue = o._id !== _id && o.model === info.model
          if (isTrue) throw ErrorInfo(CODE.ERROR_PARTMODEL_UNIQUE)
        })
      }
      for (let e of listData) {
        if (e._id === _id) {
          e.model      = info.model || e.model
          e.name       = info.name || e.name
          e.counts     = info.counts || e.counts
          e.species    = info.species || e.species
        }
      }
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { _id }))
    } catch (error) {
      reject(error)
    }
  })
}

export function remove (ids) {
  ids = _.isString(ids) && [ids]
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      ids && _.remove(listData, o => ids.indexOf(o._id) > -1)
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(listData)
    } catch (error) {
      reject(error)
    }
  })
}

export function removeSync (ids) {
  return remove(ids)
    .then(async (ret) => {
      const _ret = []
      for (let e of ret) {
        let part = await speciesProxy.findOne({ sid: e.species }, e)
        _ret.push(part)
      }
      return _ret
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