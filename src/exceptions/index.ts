type ErrorName =
	'UNKNOWN_ERROR'
	| 'BAD_REQUEST'
	| 'UNPROCESSABLE_ENTITY'
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


export class UnprocessableEntityError extends BaseError<'UNPROCESSABLE_ENTITY'> {
	constructor(message: string, description?: string, cause?: any) {
		super({
			name: 'UNPROCESSABLE_ENTITY',
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
	constructor(error: Error, message: string, description?: string, cause?: any) {
		super({
			name: 'INTERNAL_SERVER_ERROR',
			message,
			description: description || error.message,
			cause,
		})
	}
}

export const ErrorService = {
	createBadRequestError: (message: string, description?: string, cause?: any): BadRequestError => new BadRequestError(message, description, cause),
	createUnprocessableEntityError: (message: string, description?: string, cause?: any): UnprocessableEntityError => new UnprocessableEntityError(message, description, cause),
	createNotFoundError: (message: string, description?: string, cause?: any): NotFoundError => new NotFoundError(message, description),
	createInternalServerError: (error: Error, message: string, description?: string, cause?: any): InternalServerError => new InternalServerError(error, message, description, cause),
}