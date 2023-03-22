import express, { Router } from 'express'
import { IRequest } from '../types'
import UserController, { SearchRequest } from './controller'

const router: Router = express.Router({ strict: true })


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

router.post('/search', async (req: IRequest<SearchRequest>, res, next) => {
	try {
		const { email } = req.body
		const controller = new UserController()
		const response = await controller.getByEmail({ email })
		res.json(response)
	} catch (error) {
		console.error(error)
		res.send(error)
	}
})





export default router
export { router }