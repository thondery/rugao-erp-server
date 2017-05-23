import { mounts } from 'kenote-mount'
import path from 'path'
import { CustomError } from '../../error'

const { 
  speciesProxy,
  partProxy
} = mounts(path.resolve(__dirname, '../../proxys'), 'Proxy')

export const getList = (auth, req, res, next) => {
  speciesProxy.getListSync()
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const create = (data, req, res, next) => {
  const { name } = data
  speciesProxy.create(name)
    .then(async (ret) => {
      let parts = await partProxy.find({ species: ret.sid })
      ret.counts = parts.length
      return res.api(ret)
    })
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const edit = (data, req, res, next) => {
  const { id, name } = data
  speciesProxy.update(id, { name })
    .then(async (ret) => {
      let parts = await partProxy.find({ species: ret.sid })
      ret.counts = parts.length
      return res.api(ret)
    })
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const remove = (data, req, res, next) => {
  const { id } = data
  speciesProxy.remove(id)
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}