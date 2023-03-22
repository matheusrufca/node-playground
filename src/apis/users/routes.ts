import express, { Router } from 'express'
import UserController from './controller'

const router: Router = express.Router()

/* GET users listing. */
router.get('/', async (req, res, next) => {
	try {
		const controller = new UserController()
		const response = await controller.getAll()
		res.json(response)
	} catch (error) {
		console.error(error)
	}
})


export default router
export { router }