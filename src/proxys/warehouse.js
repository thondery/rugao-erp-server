import Promise from 'bluebird'
import objectid from 'objectid'
import moment from 'moment'
import uuid from 'uuid'
import path from 'path'
import fs from 'fs-extra'
import config from '../config'
import * as partProxy from './part'
import { CODE, ErrorInfo, CustomError } from '../error'

const dataDir = path.resolve(config.data, 'warehouse.db')

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
        let item = await partProxy.findOne({ _id: e.part }, e)
        _ret.push(item)
      }
      return _ret
    })
}

export function create (part, count, type, operator) {
  return new Promise(async (resolve, reject) => {
    try {
      const listData = await getList()
      const _id = objectid()
      listData.push({
        _id       : _id,
        part      : part,
        count     : count,
        type      : type,
        operator  : _.pick(operator, ['uid', 'username']),
        createAt  : moment().format()
      })
      fs.writeJSONSync(dataDir, listData, { spaces: 2 })
      resolve(_.find(listData, { _id }))
    } catch (error) {
      reject(error)
    }
  })
}


/*
[
  {
    "_id": "5924ff1ff9857ea763000034",
    "part": "零件id",
    "type": "类型：import|output",
    "number": 数量,
    "reason": "原由",
    "operator": "操作人",
    "craeteAt": "操作时间"
  }
]
*/