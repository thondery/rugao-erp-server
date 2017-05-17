import path from 'path'
import express from 'express'
import { mounts } from 'kenote-mount'
import * as auth from '../middlewares/auth'

const router = express.Router()
const { 
  userPolice,
  socketPolice
} = mounts(path.resolve(__dirname, '../polices/api_v1'), 'police')
const { 
  userApi, 
  socketApi,
  groupApi
} = mounts(path.resolve(__dirname, '../api/v1'), 'api')

router.post ( '/login',                  userPolice.login,         userApi.login              )
router.post ( '/accesstoken',            auth.accessToken,         userApi.accessToken        )

router.get  ( '/admins/group',           auth.accessToken,         groupApi.getList                             )

export default router