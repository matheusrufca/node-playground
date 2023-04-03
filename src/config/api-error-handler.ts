import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { ResponseError } from '../apis/types'
import { HttpBaseError } from '../exceptions'


const toResponseError = (error: Error): ResponseError => {
	if (error instanceof HttpBaseError) {
		return {
			code: error.name,
			message: error.message,
			description: error.description,
		}
	}

	return {
		code: '',
		message: 'Unexpected error',
		description: error.message,
	}
}

export const apiErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {

	const httpStatus = error instanceof HttpBaseError
		? error.code
		: StatusCodes.INTERNAL_SERVER_ERROR

	res.status(httpStatus)
	res.send(toResponseError(error))
}


