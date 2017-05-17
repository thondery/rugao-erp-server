import crypto from 'crypto'
import { CODE, ErrorInfo } from '../error'

export function md5 (text) {
  return crypto.createHash('sha1').update(text).digest('hex')
}

export const res_api = (req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*')
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
  res.api = (data, code = CODE.ERROR_STATUS_NULL) => {
    const status = ErrorInfo(code, true) || null
    return res.json({ data, status })
  }
  return next()
}