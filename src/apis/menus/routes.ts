import express, { Router } from 'express'

import { MenuController } from './controller'

const router: Router = express.Router({ strict: true })


router.get('/seed', async (req, res, next) => {
	try {
		const controller = new MenuController()
		const response = await controller.seed()
		res.json(response)
	} catch (error) {
		next(error)
	}
})

export default router
export { router }

