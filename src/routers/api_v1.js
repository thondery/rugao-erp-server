import path from 'path'
import express from 'express'
import { mounts } from 'kenote-mount'
import * as auth from '../middlewares/auth'

const router = express.Router()
const { 
  userPolice,
  groupPolice
} = mounts(path.resolve(__dirname, '../polices/api_v1'), 'police')
const { 
  userApi,
  groupApi
} = mounts(path.resolve(__dirname, '../api/v1'), 'api')

router.post ( '/login',                  userPolice.login,         userApi.login              )
router.post ( '/accesstoken',            auth.accessToken,         userApi.accessToken        )

router.get  ( '/admins/group',           auth.accessToken,         groupApi.getList                             )
router.post ( '/admins/group/edit/:id',  auth.accessToken,         groupPolice.edit,         groupApi.edit      )
router.post ( '/admins/group/create',    auth.accessToken,         groupPolice.create,       groupApi.create    )
router.post ( '/admins/group/remove',    auth.accessToken,         groupPolice.remove,       groupApi.remove    )

router.get  ( '/admins/user',            auth.accessToken,         userApi.getList                              )
router.post ( '/admins/user/edit/:uid',  auth.accessToken,         userPolice.edit,          userApi.edit       )
router.post ( '/admins/user/create',     auth.accessToken,         userPolice.create,        userApi.create     )
router.post ( '/admins/user/remove',     auth.accessToken,         userPolice.remove,        userApi.remove     )

router.post ( '/passport/editpwd',       auth.accessToken,         userPolice.editpwd,       userApi.editpwd    )

export default router