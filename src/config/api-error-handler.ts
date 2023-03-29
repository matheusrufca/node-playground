import { NextFunction, Request, Response } from 'express'
import { getStatusCode, StatusCodes } from 'http-status-codes'

import { ResponseError } from '../apis/types'
import { BadRequestError, BaseError, NotFoundError } from '../exceptions'


const toResponseError = (error: Error): ResponseError => {
	if (error instanceof BaseError) {
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
	switch (error.constructor) {
		case BadRequestError: {
			res.status(StatusCodes.BAD_REQUEST)
			break
		}
		case BadRequestError: {
			res.status(StatusCodes.UNPROCESSABLE_ENTITY)
			break
		}
		case NotFoundError: {
			res.status(StatusCodes.NOT_FOUND)
			break
		}
		default: {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR)
			break
		}
	}
	res.send(toResponseError(error))
}


