import { NextFunction, Request, Response } from 'express';
import { ErrorService } from '../exceptions';
import { validateToken } from './../utils/auth';


export const isAuthenticatedHandler = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization || ''
	const [, token] = authHeader.split(' ')

	console.debug('req', JSON.stringify(req.headers.authorization))

	if (token) {
		try {
			const user = await validateToken(token)
			// req['user'] = user
			next()
		} catch (error) {
			next(error)
		}
	} else {
		next(ErrorService.createUnauthorizedError('Token not present'))
	}
}

export default isAuthenticatedHandler