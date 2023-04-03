import { NextFunction, Request, Response } from 'express';
import { ErrorService } from '../exceptions';
import { validateToken, validateUserIdentity } from '../utils/security';


export const isAuthenticatedHandler = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization || ''
	const [, token] = authHeader.split(' ')

	if (token) {
		try {
			const user = await validateToken(token)
			req.user = user
			next()
		} catch (error) {
			next(error)
		}
	} else {
		next(ErrorService.createUnauthorizedError('Token not present'))
	}
}

export const validateUserIdentityHandler = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user)
		throw ErrorService.createUnauthorizedError('User not authenticated')

	const { entityId } = req.params
	const authHeader = req.headers.authorization || ''
	const [, token] = authHeader.split(' ')

	validateUserIdentity(token, entityId)
		.then(next)
		.catch(next)
}

export default isAuthenticatedHandler