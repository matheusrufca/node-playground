import express from 'express'
import { UserRepository } from '../repository';

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
	try {
		const users = await UserRepository.getAll()
		res.json(users)
	} catch (error) {
		console.error(error)
	}
});


export default router
export { router }