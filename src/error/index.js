import * as Code from './code'
import * as Message from './message'

const errors = []
for (let e in Code) {
  errors.push({
    code: Code[e],
    message: Message[e]
  })
}

export default errors

export const CODE = Code

export const ErrorInfo = (code, json = false) => {
  const info = _.find(errors, { code })
  if (json) return info
  const error = new Error(info.message)
  error.code = info.code
  return error
}

export const CustomError = e => e.code >= 1000