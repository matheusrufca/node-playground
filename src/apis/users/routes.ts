import express, { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import isAuthenticatedHandler from '../../config/api-auth'

import { validationHandler } from './../../config/api-validation'
import { UserController } from './controller'
import { ChangeEmailRequest, ChangePassword, EditProfileRequest, GetResponse, Params, RegisterUserRequest, SearchRequest } from './models'

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


router.get('/:entityId', isAuthenticatedHandler, async (req: Request<Params, GetResponse>, res, next) => {
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


router.post('/register', validationHandler(RegisterUserRequest), async (req: Request<{}, void, RegisterUserRequest>, res: Response, next) => {
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

router.patch('/:entityId/change-password', isAuthenticatedHandler, validationHandler(ChangePassword), async (req: Request<Params, void, ChangePassword>, res: Response, next) => {
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


router.patch('/:entityId/change-email', isAuthenticatedHandler, validationHandler(ChangeEmailRequest), async (req: Request<Params, void, ChangeEmailRequest>, res: Response, next) => {
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

router.put('/:entityId/profile', isAuthenticatedHandler, validationHandler(EditProfileRequest), async (req: Request<Params, void, EditProfileRequest>, res: Response, next) => {
	try {
		const { entityId } = req.params
		const controller = new UserController()
		const response = await controller.editProfile(entityId, req.body)
		res.status(StatusCodes.OK)
		res.json(response)
	} catch (error) {
		next(error)
	}
})


export default router
export { router }

