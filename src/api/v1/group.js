import { mounts } from 'kenote-mount'
import path from 'path'
import { CustomError } from '../../error'

const { 
  groupProxy, 
  userProxy, 
  flagProxy 
} = mounts(path.resolve(__dirname, '../../proxys'), 'Proxy')

export const getList = (auth, req, res, next) => {
  groupProxy.getListSync()
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const edit = (data, req, res, next) => {
  const { id, name, level, flag } = data
  groupProxy.update(id, { name, level, flag })
    .then(async (ret) => {
      let users = await userProxy.find({ group: ret.gid })
      ret.counts = users.length
      return res.api(ret)
    })
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const create = (data, req, res, next) => {
  const { name, level, flag } = data
  groupProxy.create(name, level, flag)
    .then(async (ret) => {
      let users = await userProxy.find({ group: ret.gid })
      ret.counts = users.length
      return res.api(ret)
    })
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const remove = (data, req, res, next) => {
  const { id } = data
  groupProxy.removeSync(id)
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}