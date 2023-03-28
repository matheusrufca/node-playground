import express, { Router, Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { IRequest } from '../types'
import UserController from './controller'
import { CreateUserRequest, EditUserRequest, GetResponse, Params, SearchRequest, UpsertUserRequest } from './models'

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

router.get('/:entityId', async (req: Request<Params, GetResponse>, res, next) => {
	try {
		const { entityId } = req.params
		const controller = new UserController()
		const response = await controller.getById(entityId)
		res.json(response)
	} catch (error) {
		next(error)
	}
})

router.post('/', async (req: Request<{}, void, CreateUserRequest>, res, next) => {
	try {
		const controller = new UserController()
		const response = await controller.create(req.body)
		res.status(StatusCodes.CREATED)
		res.json(response)
	} catch (error) {
		next(error)
	}
})

router.patch('/:entityId', async (req: Request<Params, void, EditUserRequest>, res, next) => {
	try {
		const { entityId } = req.params
		const controller = new UserController()
		const response = await controller.editWithId(entityId, req.body)
		res.status(StatusCodes.CREATED)
		res.json(response)
	} catch (error) {
		next(error)
	}
})


router.put('/:entityId', async (req: Request<Params, void, UpsertUserRequest>, res, next) => {
	try {
		const { entityId } = req.params
		const controller = new UserController()
		const response = await controller.upsert(entityId, req.body)
		res.status(StatusCodes.CREATED)
		res.json(response)
	} catch (error) {
		next(error)
	}
})

router.post('/search', async (req: Request<{}, GetResponse, SearchRequest>, res, next) => {
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
