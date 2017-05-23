import { mounts } from 'kenote-mount'
import path from 'path'
import { CustomError } from '../../error'

const { 
  speciesProxy,
  partProxy
} = mounts(path.resolve(__dirname, '../../proxys'), 'Proxy')

export const getList = (auth, req, res, next) => {
  const info = {}
  partProxy.getListSync()
    .then( ret => {
      info.parts = ret
      return speciesProxy.getList()
    })
    .then( ret => {
      info.species = ret
      return res.api(info)
    })
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const create = (data, req, res, next) => {
  const { model, name, species } = data
  partProxy.create(model, name, species)
    .then( ret => {
      return speciesProxy.findOne({ sid: ret.species }, ret)
    })
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const edit = (data, req, res, next) => {
  const { id, model, name, species } = data
  partProxy.update(id, { model, name, species })
    .then( ret => {
      return speciesProxy.findOne({ sid: ret.species }, ret)
    })
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}

export const remove = (data, req, res, next) => {
  const { id } = data
  partProxy.removeSync(id)
    .then( ret => res.api(ret.data || ret) )
    .catch(CustomError, err => res.api(null, err.code) )
    .catch( err => next(err) )
}