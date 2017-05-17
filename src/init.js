import Promise from 'bluebird'
import { mounts } from 'kenote-mount'
import fs from 'fs'
import path from 'path'
import { CustomError } from './error'
import initData from '../data.json'

const dataDir = path.resolve(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

const { 
  groupProxy, 
  userProxy, 
  flagProxy 
} = mounts(path.resolve(__dirname, 'proxys'), 'Proxy')
const clearAll = [
  groupProxy.clear(), 
  userProxy.clear(),
  flagProxy.clear()
]
const { group, user, flag } = initData

// 创建默认用户组
Promise.all(clearAll)
  .then( () => {
    // 写入页面权限
    return flagProxy.setData(flag)
  })
  .then( ret => {
    // 创建顶级用户组
    return groupProxy.create(group.name, 0)
  })
  .then( ret => {
    // 创建总管理员
    return userProxy.create(user.username, user.password, ret.gid)
  })
  .then( ret => {
    console.log(`初始化数据成功！`)
  })
  .catch(CustomError, err => {
    const { code, message } = err
    console.log({ code, message })
  })
  .catch( err => {
    console.log(err)
  })
