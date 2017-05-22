import Promise from 'bluebird'
import objectid from 'objectid'
import path from 'path'
import fs from 'fs-extra'
import config from '../config'
import * as flagProxy from './flag'
import * as userProxy from './user'
import { CODE, ErrorInfo, CustomError } from '../error'

const dataDir = path.resolve(config.data, 'group.db')

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
        let users = await userProxy.find({ group: e.gid })
        e.counts = users.length
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

export function findOne (query, collection = null, field = 'group') {
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

export const findOneSync = async (query) => {
  
    try {
      const ret = await findOne(query)
      return JSON.stringify(ret)
    } catch (error) {
      return error
    }
  
}

export function create (name, level, flag = []) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      const flags = await flagProxy.getList()
      const isTrue = _.find(listData, { name })
      if (isTrue) throw ErrorInfo(CODE.ERROR_GROUPNAME_UNIQUE)
      listData.push({
        gid   : objectid(),
        name  : name,
        level : level,
        flag  : level === 0 ? _.map(flags, 'id') : flag,
        lock  : level === 0
      })
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { name }))
    } catch (error) {
      reject(error)
    }
  })
}

export function update (gid, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      if (info.name) {
        _.find(listData, o => {
          const isTrue = o.gid !== gid && o.name === info.name
          if (isTrue) throw ErrorInfo(CODE.ERROR_GROUPNAME_UNIQUE)
        })
      }
      for (let e of listData) {
        if (e.gid === gid) {
          e.name = info.name || e.name
          e.level = info.level || e.level
          e.flag = info.flag || e.flag
        }
      }
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { gid }))
    } catch (error) {
      reject(error)
    }
  })
}

export function remove (gids) {
  gids = _.isString(gids) && [gids]
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      _.remove(listData, o => gids.indexOf(o.gid) > -1)
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(listData)
    } catch (error) {
      reject(error)
    }
  })
}

export function removeSync (gid) {
  return userProxy.find({ group: gid })
    .then( ret => {
      const groups = _.map(ret, 'group')
      return userProxy.remove(groups)
    })
    .then( ret => remove(gid))
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