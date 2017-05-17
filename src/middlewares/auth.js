import path from 'path'
import { mounts } from 'kenote-mount'
import { CustomError } from '../error'

const { 
  userProxy
} = mounts(path.resolve(__dirname, '../proxys'), 'proxy')

export const accessToken = (req, res, next) => {
  const { accesstoken } = req.method === 'POST' ? req.body : req.query
  return userProxy.accessToken(accesstoken)
    .then( ret => {
      next(ret)
      return null
    })
    .catch( CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}