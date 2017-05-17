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