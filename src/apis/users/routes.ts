import express, { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IRequest } from '../types'
import UserController from './controller'
import { CreateUserRequest, SearchRequest } from './models'

const router: Router = express.Router({ strict: true })


router.get('/', async (req, res, next) => {
	try {
		const controller = new UserController()
		const response = await controller.getAll()
		res.json(response)
	} catch (error) {
		next(error)
	}
})

router.get('/:entityId', async (req, res, next) => {
	try {
		const { entityId } = req.params
		const controller = new UserController()
		const response = await controller.getById(entityId)
		res.json(response)
	} catch (error) {
		next(error)
	}
})

router.post('/', async (req:IRequest<CreateUserRequest>, res, next) => {
	try {
		const controller = new UserController()
		const response = await controller.create(req.body)
		res.status(StatusCodes.CREATED)
		res.json(response)
	} catch (error) {
		next(error)
	}
})

router.post('/search', async (req: IRequest<SearchRequest>, res, next) => {
	try {
		const { email } = req.body
		const controller = new UserController()
		const response = await controller.getByEmail({ email })
		res.json(response)
	} catch (error) {
		next(error)
	}
})


export default router
export { router }
