import express from 'express'
import AuthRouter from './auth/routes'
import UserRouter from './users/routes'

const router = express.Router()

router.use('/auth', AuthRouter )
router.use('/users', UserRouter)

export default router