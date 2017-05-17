import { mounts } from 'kenote-mount'
import path from 'path'
import { CustomError } from '../../error'

const { 
  groupProxy, 
  userProxy, 
  flagProxy 
} = mounts(path.resolve(__dirname, '../../proxys'), 'Proxy')

export const getList = (auth, req, res, next) => {
  groupProxy.getList()
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}