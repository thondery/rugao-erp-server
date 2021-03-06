import { CODE, ErrorInfo, CustomError } from '../../error'

export const edit = (auth, req, res, next) => {
  const { name } = req.body
  const data = {
    name,
    id: req.params.id
  }
  if (!data.id || data.id.length !== 24) {
    return res.api(null, CODE.ERROR_SPECIESNAME_MARKUP)
  }
  if (!name) {
    return res.api(null, CODE.ERROR_SPECIESNAME_REQUIRED)
  }
  return next(data)
}

export const create = (auth, req, res, next) => {
  const { name } = req.body
  const data = {
    name
  }
  if (!name) {
    return res.api(null, CODE.ERROR_SPECIESNAME_REQUIRED)
  }
  return next(data)
}

export const remove = (auth, req, res, next) => {
  const { id } = req.body
  const data = {
    id
  }
  if (!data.id || data.id.length !== 24) {
    return res.api(null, CODE.ERROR_SPECIESNAME_MARKUP)
  }
  return next(data)
}