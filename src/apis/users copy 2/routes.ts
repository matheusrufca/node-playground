import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'

import { validationHandler } from '../../config/api-validation'
import UserController from './controller'
import { ChangeEmail, ChangePassword, GetResponse, Params, RegisterUser, SearchRequest } from './models'

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


router.post('/register', validationHandler(RegisterUser), async (req: Request<{}, void, RegisterUser>, res: Response, next) => {
	try {
		const controller = new UserController()
		const response = await controller.register(req.body)
		res.status(StatusCodes.CREATED)
		res.json(response)
	} catch (error) {
		next(error)
	}
})

router.patch('/:entityId/change-password', validationHandler(ChangePassword), async (req: Request<Params, void, ChangePassword>, res: Response, next) => {
	try {
		const { entityId } = req.params
		const controller = new UserController()
		const response = await controller.changePassword(entityId, req.body)
		res.status(StatusCodes.OK)
		res.json(response)
	} catch (error) {
		next(error)
	}
})


router.patch('/:entityId/change-email', validationHandler(ChangeEmail), async (req: Request<Params, void, ChangeEmail>, res: Response, next) => {
	try {
		const { entityId } = req.params
		const controller = new UserController()
		const response = await controller.changeEmail(entityId, req.body)
		res.status(StatusCodes.OK)
		res.json(response)
	} catch (error) {
		next(error)
	}
})


export default router
export { router }

