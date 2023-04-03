import express, { Request, Router } from 'express'

import { AuthController } from './controller'
import { AuthTokenRequest, AuthTokenResponse } from './models'

const router: Router = express.Router({ strict: true })

router.post("/token", async (req: Request<{}, AuthTokenResponse, AuthTokenRequest>, res, next) => {
	try {
		const controller = new AuthController()
		const response = await controller.authenticate(req.body)
		res.json(response)
	} catch (error) {
		next(error)
	}
})

export default router