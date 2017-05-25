import path from 'path'
import express from 'express'

const router = express.Router()

router.get ( '/*', (req, res, next) => res.sendfile('public/index.html') )

export default router