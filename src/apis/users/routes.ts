import express, { Router } from 'express'
import UserController from './controller'

const router: Router = express.Router()

router.get('/', async (req, res, next) => {
	try {
		const controller = new UserController()
		const response = await controller.getAll()
		res.json(response)
	} catch (error) {
		console.error(error)
	}
})

router.get('/:entityId', async (req, res, next) => {
	try {
		const { entityId } = req.params
		const controller = new UserController()
		const response = await controller.getById(entityId)
		res.json(response)
	} catch (error) {
		console.error(error)
	}
})

router.get('/by/email/:email', async (req, res, next) => {
	try {
		const { email } = req.params
		const controller = new UserController()
		const response = await controller.getByEmail(email)
		res.json(response)
	} catch (error) {
		console.error(error)
	}
})


export default router
export { router }