import express from 'express'
import UserRouter from './users/routes'
import AuthRouter from './users/routes'

const router = express.Router()


// app.use('/', indexRouter)

router.use('/auth', UserRouter)
router.use('/users', AuthRouter)

export default router