import path from 'path'
import express from 'express'
import { mounts } from 'kenote-mount'
import * as auth from '../middlewares/auth'

const router = express.Router()
const { 
  userPolice,
  groupPolice,
  speciesPolice,
  partPolice
} = mounts(path.resolve(__dirname, '../polices/api_v1'), 'police')
const { 
  userApi,
  groupApi,
  speciesApi,
  partApi
} = mounts(path.resolve(__dirname, '../api/v1'), 'api')

router.post ( '/login',                          userPolice.login,         userApi.login              )
router.post ( '/accesstoken',                    auth.accessToken,         userApi.accessToken        )

router.get  ( '/admins/group',                   auth.accessToken,         groupApi.getList                                  )
router.post ( '/admins/group/edit/:id',          auth.accessToken,         groupPolice.edit,         groupApi.edit           )
router.post ( '/admins/group/create',            auth.accessToken,         groupPolice.create,       groupApi.create         )
router.post ( '/admins/group/remove',            auth.accessToken,         groupPolice.remove,       groupApi.remove         )

router.get  ( '/admins/user',                    auth.accessToken,         userApi.getList                                   )
router.post ( '/admins/user/edit/:uid',          auth.accessToken,         userPolice.edit,          userApi.edit            )
router.post ( '/admins/user/create',             auth.accessToken,         userPolice.create,        userApi.create          )
router.post ( '/admins/user/remove',             auth.accessToken,         userPolice.remove,        userApi.remove          )

router.post ( '/passport/editpwd',               auth.accessToken,         userPolice.editpwd,       userApi.editpwd         )

router.get  ( '/partlib/species',                auth.accessToken,         speciesApi.getList                                )
router.post ( '/partlib/species/create',         auth.accessToken,         speciesPolice.create,     speciesApi.create       )
router.post ( '/partlib/species/edit/:id',       auth.accessToken,         speciesPolice.edit,       speciesApi.edit         )
router.post ( '/partlib/species/remove',         auth.accessToken,         speciesPolice.remove,     speciesApi.remove       )

router.get  ( '/partlib/part',                   auth.accessToken,         partApi.getList                                   )
router.post ( '/partlib/part/create',            auth.accessToken,         partPolice.create,        partApi.create          )
router.post ( '/partlib/part/edit/:id',          auth.accessToken,         partPolice.edit,          partApi.edit            )
router.post ( '/partlib/part/remove',            auth.accessToken,         partPolice.remove,        partApi.remove          )

export default router