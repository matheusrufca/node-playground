import { ClassConstructor, plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { Request, Response, NextFunction, RequestHandler } from 'express'

import { BadRequestError } from '../exceptions'

const extractErrorMessages = (errors: ValidationError[]): string => {
	return errors.map(({ constraints }) => {
		if (!constraints) return ''
		return Object.entries(constraints).map(([key, value]) => value).join('\n')
	}).join('\n')
}

const handleRequest = async <T extends object>(
	dtoClass: ClassConstructor<T>,
	req: Request,
): Promise<void> => {
	try {
		const validationResult = plainToInstance(dtoClass, req.body)
		await validateOrReject(validationResult, { skipMissingProperties: true })
	} catch (error) {
		const errorMessage = extractErrorMessages(error as ValidationError[])
		throw new BadRequestError('Invalid request', errorMessage, error)
	}
}

export const validationHandler = <T extends object>(
	dtoClass: ClassConstructor<T>
): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
		return Promise
			.resolve(handleRequest(dtoClass, req))
			.then(next)
			.catch(next)
	}
}