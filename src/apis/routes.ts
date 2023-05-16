import express from 'express'
import AuthRouter from './auth/routes'
import MenuRouter from './menus/routes'
import UserRouter from './users/routes'

const router = express.Router()

router.use('/auth', AuthRouter )
router.use('/users', UserRouter)
router.use('/menus', MenuRouter)

router.get('/abab', async (req, res, next) => {
	try {
		const response = {}
		res.json(response)
	} catch (error) {
		next(error)
	}
})

export default router