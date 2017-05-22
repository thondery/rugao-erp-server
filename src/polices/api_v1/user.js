import validator from 'validator'
import { CODE, ErrorInfo, CustomError } from '../../error'

const validData = {
  /*['email']: { 
    pattern: email => validator.isEmail(email)
  },*/
  ['username']: {
    min: 4,
    max: 12,
    pattern: username => validator.matches(username, /^[a-z0-9_]+$/)
  },
  ['password']: {
    min: 6,
    max: 24,
    pattern: password => validator.matches(password, /^[a-z0-9_-]+$/)
  }
}

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

export const edit = (auth, req, res, next) => {
  const { username, password, group } = req.body
  const data = {
    username, 
    password, 
    group,
    uid: req.params.uid
  }
  if (!data.uid || data.uid.length !== 24) {
    return res.api(null, CODE.ERROR_ADMINUSER_MARKUP)
  }
  if (!username) {
    return res.api(null, CODE.ERROR_USERNAME_REQUIRED)
  }
  const validDataByUsername = validData['username']
  if (validDataByUsername.min > username.length) {
    return res.api(null, CODE.ERROR_USERNAME_MINSIZE)
  }
  if (validDataByUsername.max < username.length) {
    return res.api(null, CODE.ERROR_USERNAME_MAXSIZE)
  }
  if (!validDataByUsername.pattern(username)) {
    return res.api(null, CODE.ERROR_USERNAME_FORMAT)
  }
  if (password) {
    const validDataByPassword = validData['password']
    if (validDataByPassword.min > password.length) {
      return res.api(null, CODE.ERROR_PASSWORD_MINSIZE)
    }
    if (validDataByPassword.max < password.length) {
      return res.api(null, CODE.ERROR_PASSWORD_MAXSIZE)
    }
    if (!validDataByPassword.pattern(password)) {
      return res.api(null, CODE.ERROR_PASSWORD_FORMAT)
    }
  }
  return next(data)
}

export const create = (auth, req, res, next) => {
  const { username, group } = req.body
  const data = {
    username, 
    password: '123456', 
    group
  }
  if (!username) {
    return res.api(null, CODE.ERROR_USERNAME_REQUIRED)
  }
  const validDataByUsername = validData['username']
  if (validDataByUsername.min > username.length) {
    return res.api(null, CODE.ERROR_USERNAME_MINSIZE)
  }
  if (validDataByUsername.max < username.length) {
    return res.api(null, CODE.ERROR_USERNAME_MAXSIZE)
  }
  if (!validDataByUsername.pattern(username)) {
    return res.api(null, CODE.ERROR_USERNAME_FORMAT)
  }
  return next(data)
}

export const remove = (auth, req, res, next) => {
  const { uid } = req.body
  const data = {
    uid
  }
  if (!data.uid || data.uid.length !== 24) {
    return res.api(null, CODE.ERROR_ADMINUSER_MARKUP)
  }
  return next(data)
}

export const editpwd = (auth, req, res, next) => {
  const { password } = req.body
  const data = {
    password,
    auth
  }
  const validDataByPassword = validData['password']
  if (validDataByPassword.min > password.length) {
    return res.api(null, CODE.ERROR_PASSWORD_MINSIZE)
  }
  if (validDataByPassword.max < password.length) {
    return res.api(null, CODE.ERROR_PASSWORD_MAXSIZE)
  }
  if (!validDataByPassword.pattern(password)) {
    return res.api(null, CODE.ERROR_PASSWORD_FORMAT)
  }
  return next(data)
}