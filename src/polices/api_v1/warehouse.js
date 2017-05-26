import validator from 'validator'
import { CODE, ErrorInfo, CustomError } from '../../error'

export const create = (auth, req, res, next) => {
  const { part, count, type } = req.body
  const data = {
    part, 
    count, 
    type,
    auth
  }
  if (!part || part.length !== 24) {
    return res.api(null, CODE.ERROR_PARTMODEL_MARKUP)
  }
  if (!count) {
    return res.api(null, CODE.ERROR_PARTCOUNT_REQUIRED)
  }
  //console.log(validator.isInt(count))
  //if (!validator.isInt(count)) {
  //  return res.api(null, CODE.ERROR_PARTCOUNT_FORMAT)
  //}
  return next(data)
}