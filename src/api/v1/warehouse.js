import { mounts } from 'kenote-mount'
import path from 'path'
import { CustomError } from '../../error'

const { 
  userProxy,
  speciesProxy,
  partProxy,
  warehouseProxy
} = mounts(path.resolve(__dirname, '../../proxys'), 'Proxy')

export const getList = (auth, req, res, next) => {
  const info = {}
  warehouseProxy.getListSync()
    .then( ret => {
      info.warehouse = ret
      return res.api(info)
    })
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const create = (data, req, res, next) => {
  const { part, count, type, auth } = data
  partProxy.updateByCount(part, type === 'output' ? -count : count)
    .then( ret => {
      return warehouseProxy.create(part, count, type, auth)
    })
    .then( ret => {
      return partProxy.findOne({ _id: ret.part }, ret)
    })
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}