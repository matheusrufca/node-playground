import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { BadRequestError } from '../exceptions'

const validateRequestBody = async <T extends object, B = {}>(
	dtoClass: ClassConstructor<T>,
	body: B
): Promise<void> => {
	const result = plainToInstance(dtoClass, body)
	return await validateOrReject(result, { skipMissingProperties: true })
}

const handleInvalidRequest = async <T extends object>(
	req: Request,
	dtoClass: ClassConstructor<T>
): Promise<void> => {
	try {
		await validateRequestBody(dtoClass, req.body)
	} catch (error) {
		const errors = error as ValidationError[]
		const errorMessage = errors.map(({ constraints }) => {
			if (!constraints) return []
			return Object.entries(constraints).map(([key, value]) => value).join('\n')
		}).join('\n')

		throw new BadRequestError('Invalid request', errorMessage, error)
	}
}

export const apiRequestValidation = <T extends object>(
	dtoClass: ClassConstructor<T>
): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		return Promise
			.resolve(handleInvalidRequest(req, dtoClass))
			.catch(error => next(error))
	}
}