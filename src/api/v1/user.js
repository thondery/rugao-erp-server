import { mounts } from 'kenote-mount'
import path from 'path'
import { CustomError } from '../../error'

const { 
  groupProxy, 
  userProxy, 
  flagProxy 
} = mounts(path.resolve(__dirname, '../../proxys'), 'Proxy')

export const login = (data, req, res, next) => {
  const { username, password } = data
  userProxy.login(username, password)
    .then( auth => res.api({auth}) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const accessToken = (auth, req, res, next) => res.api({auth})

export const getList = (auth, req, res, next) => {
  const info = {}
  userProxy.getListSync()
    .then( ret => {
      info.users = ret
      return groupProxy.find({ lock: false })
    })
    .then( ret => {
      info.groups = ret
      return res.api(info)
    })
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const edit = (data, req, res, next) => {
  const { uid, username, password, group } = data
  userProxy.update(uid, { username, password, group })
    .then( ret => {
      return groupProxy.findOne({ gid: ret.group }, ret)
    })
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const create = (data, req, res, next) => {
  const { username, password, group } = data
  userProxy.create(username, password, group)
    .then( ret => {
      return groupProxy.findOne({ gid: ret.group }, ret)
    })
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const remove = (data, req, res, next) => {
  const { uid } = data
  userProxy.removeSync(uid)
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const editpwd = (data, req, res, next) => {
  const { auth, password } = data
  userProxy.update(auth.uid, { password })
    .then( ret => {
      return groupProxy.findOne({ gid: ret.group }, ret)
    })
    .then( ret => _.pick(ret, ['uid', 'username', 'tokenkey', 'group']) )
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}