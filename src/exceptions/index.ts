type ErrorName =
	'UNKNOWN_ERROR'
	| 'BAD_REQUEST'
	| 'NOT_FOUND'
	| 'INTERNAL_SERVER_ERROR'

type BaseErrorConstructor<T extends ErrorName> = {
	name: T,
	message: string,
	cause?: any,
	description?: string
}

export class BaseError<T extends ErrorName = ErrorName> extends Error {
	name: T
	message: string
	cause: any
	description?: string

	constructor({ name, message, cause, description }: BaseErrorConstructor<T>) {
		super(message)
		this.name = name
		this.message = message
		this.cause = cause
		this.description = description
	}
}

export class BadRequestError extends BaseError<'BAD_REQUEST'> {
	constructor(message: string, description?: string, cause?: any) {
		super({
			name: 'BAD_REQUEST',
			message,
			description,
			cause,
		})
	}
}

export class NotFoundError extends BaseError<'NOT_FOUND'> {
	constructor(message: string, description?: string) {
		super({
			name: 'NOT_FOUND',
			message,
			description,
		})
	}
}

export class InternalServerError extends BaseError<'INTERNAL_SERVER_ERROR'> {
	constructor(error: Error, message: string, description?: string) {
		super({
			name: 'INTERNAL_SERVER_ERROR',
			message,
			description: description || error.message,
		})
	}
}

export const ServiceError = {
	createBadRequestError: (message: string, description?: string): BadRequestError => new BadRequestError(message, description),
	createNotFoundError: (message: string, description?: string): NotFoundError => new NotFoundError(message, description),
	createInternalServerError: (error: Error, message: string, description?: string): InternalServerError => new InternalServerError(error, message, description),
}