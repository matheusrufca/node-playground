import express, { Request, Router } from 'express'
import { StatusCodes } from 'http-status-codes'

import UserController from './controller'
import { CreateUserRequest, EditUserRequest, GetResponse, Params, RegisterUser, SearchRequest, UpsertUserRequest } from './models'
import { validationHandler } from './../../config/api-validation'

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


router.post('/register', validationHandler(RegisterUser), async (req: Request<{}, void, RegisterUser>, res, next) => {
	try {
		const controller = new UserController()
		const response = await controller.register(req.body)
		res.status(StatusCodes.CREATED)
		res.json(response)
	} catch (error) {
		console.debug('catch error', error)
		next(error)
	}
})


export default router
export { router }

