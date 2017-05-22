import Promise from 'bluebird'
import objectid from 'objectid'
import uuid from 'uuid'
import path from 'path'
import fs from 'fs-extra'
import config from '../config'
import * as Tools from '../common/tools'
import * as groupProxy from './group'
import { CODE, ErrorInfo, CustomError } from '../error'

const dataDir = path.resolve(config.data, 'user.db')

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
        let user = await groupProxy.findOne({ gid: e.group }, e)
        _ret.push(user)
      }
      return _ret
    })
}

export function findOne (query) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      resolve(_.find(listData, query))
    } catch (error) {
      reject(error)
    }
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

export function create (username, password, group) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      const isTrue = _.find(listData, { username })
      if (isTrue) throw ErrorInfo(CODE.ERROR_USERNAME_UNIQUE)
      listData.push({
        uid       : objectid(),
        username  : username,
        password  : Tools.md5(password),
        tokenkey  : uuid.v4(),
        group     : group
      })
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { username }))
    } catch (error) {
      reject(error)
    }
  })
}

export function update (uid, info) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      if (info.username) {
        _.find(listData, o => {
          const isTrue = o.uid !== uid && o.username === info.username
          if (isTrue) throw ErrorInfo(CODE.ERROR_USERNAME_UNIQUE)
        })
      }
      const _password = info.password && Tools.md5(info.password)
      for (let e of listData) {
        if (e.uid === uid) {
          e.username = info.username || e.username
          e.password = _password || e.password
          e.group    = info.group || e.group
        }
      }
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { uid }))
    } catch (error) {
      reject(error)
    }
  })
}

export function remove (uids) {
  uids = _.isString(uids) && [uids]
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      uids && _.remove(listData, o => uids.indexOf(o.uid) > -1)
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(listData)
    } catch (error) {
      reject(error)
    }
  })
}

export function removeSync (uids) {
  return remove(uids)
    .then(async (ret) => {
      const _ret = []
      for (let e of ret) {
        let user = await groupProxy.findOne({ gid: e.group }, e)
        _ret.push(user)
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

export const validPassword = (password, encrypt) =>
  Tools.md5(password) === encrypt

export function login (username, password) {
  return findOne({ username })
    .then( ret => {
      if (!ret) throw ErrorInfo(CODE.ERROR_LOGINVALID_FAIL)
      const valide = validPassword(password, ret.password)
      if (!valide) throw ErrorInfo(CODE.ERROR_LOGINVALID_FAIL)
      return groupProxy.findOne({ gid: ret.group }, ret, 'group')
    })
    .then( ret => _.pick(ret, ['uid', 'username', 'tokenkey', 'group']) )
}

export const accessToken = accesskey => {
  return findOne({ tokenkey: accesskey })
    .then( ret => {
      if (!ret) throw ErrorInfo(CODE.ERROR_ACCESSTOKEN_NULL)
      return groupProxy.findOne({ gid: ret.group }, ret, 'group')
    })
    .then( ret => _.pick(ret, ['uid', 'username', 'tokenkey', 'group']) )
}