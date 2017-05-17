import { CODE, ErrorInfo, CustomError } from '../../error'

export const login = (req, res, next) => {
  const { username, password } = req.body
  const data = {
    username,
    password
  }
  if (!username) {
    return res.api(null, CODE.ERROR_LOGINNAME_REQUIRED)
  }
  if (!password) {
    return res.api(null, CODE.ERROR_LOGINPASS_REQUIRED)
  }
  return next(data)
}