import { StatusCodes } from 'http-status-codes'

type ErrorName =
	'UNKNOWN_ERROR'
	| 'BAD_REQUEST'
	| 'UNPROCESSABLE_ENTITY'
	| 'NOT_FOUND'
	| 'INTERNAL_SERVER_ERROR'
	| 'UNAUTHORIZED'

type HttpBaseErrorConstructor<T extends ErrorName> = {
	name: T,
	message: string,
	cause?: any,
	description?: string
	code: number
}

export class HttpBaseError<T extends ErrorName = ErrorName> extends Error {
	name: T
	message: string
	cause: any
	description?: string
	code: number

	constructor({ code, name, message, cause, description }: HttpBaseErrorConstructor<T>) {
		super(message)
		this.name = name
		this.message = message
		this.cause = cause
		this.description = description
		this.code = code
	}
}

export class BadRequestError extends HttpBaseError<'BAD_REQUEST'> {
	constructor(message: string, description?: string, cause?: any) {
		super({
			name: 'BAD_REQUEST',
			message,
			description,
			cause,
			code: StatusCodes.BAD_REQUEST,
		})
	}
}

export class UnprocessableEntityError extends HttpBaseError<'UNPROCESSABLE_ENTITY'> {
	constructor(message: string, description?: string, cause?: any) {
		super({
			name: 'UNPROCESSABLE_ENTITY',
			message,
			description,
			cause,
			code: StatusCodes.UNPROCESSABLE_ENTITY,
		})
	}
}

export class NotFoundError extends HttpBaseError<'NOT_FOUND'> {
	constructor(message: string, description?: string) {
		super({
			name: 'NOT_FOUND',
			message,
			description,
			code: StatusCodes.NOT_FOUND,
		})
	}
}

export class UnauthorizedError extends HttpBaseError<'UNAUTHORIZED'> {
	constructor(message: string, description?: string, cause?: any) {
		super({
			name: 'UNAUTHORIZED',
			message,
			description,
			cause,
			code: StatusCodes.UNAUTHORIZED,
		})
	}
}

export class InternalServerError extends HttpBaseError<'INTERNAL_SERVER_ERROR'> {
	constructor(error: Error, message: string, description?: string, cause?: any) {
		super({
			name: 'INTERNAL_SERVER_ERROR',
			message,
			description: description || error.message,
			cause,
			code: StatusCodes.INTERNAL_SERVER_ERROR,
		})
	}
}

export const ErrorService = {
	createBadRequestError: (message: string, description?: string, cause?: any): BadRequestError => new BadRequestError(message, description, cause),
	createUnprocessableEntityError: (message: string, description?: string, cause?: any): UnprocessableEntityError => new UnprocessableEntityError(message, description, cause),
	createUnauthorizedError: (message: string, description?: string, cause?: any): UnauthorizedError => new UnauthorizedError(message, description, cause),
	createNotFoundError: (message: string, description?: string): NotFoundError => new NotFoundError(message, description),
	createInternalServerError: (error: Error, message: string, description?: string, cause?: any): InternalServerError => new InternalServerError(error, message, description, cause),
}