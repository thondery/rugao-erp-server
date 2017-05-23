import validator from 'validator'
import { CODE, ErrorInfo, CustomError } from '../../error'



export const create = (auth, req, res, next) => {
  const { model, name, species } = req.body
  const data = {
    model, 
    name, 
    species
  }
  if (!model) {
    return res.api(null, CODE.ERROR_PARTMODEL_REQUIRED)
  }
  if (!name) {
    return res.api(null, CODE.ERROR_PARTNAME_REQUIRED)
  }
  return next(data)
}

export const edit = (auth, req, res, next) => {
  const { model, name, species } = req.body
  const data = {
    model, 
    name, 
    species,
    id: req.params.id
  }
  if (!data.id || data.id.length !== 24) {
    return res.api(null, CODE.ERROR_PARTMODEL_MARKUP)
  }
  if (!model) {
    return res.api(null, CODE.ERROR_PARTMODEL_REQUIRED)
  }
  if (!name) {
    return res.api(null, CODE.ERROR_PARTNAME_REQUIRED)
  }
  return next(data)
}

export const remove = (auth, req, res, next) => {
  const { id } = req.body
  const data = {
    id
  }
  if (!data.id || data.id.length !== 24) {
    return res.api(null, CODE.ERROR_PARTMODEL_MARKUP)
  }
  return next(data)
}