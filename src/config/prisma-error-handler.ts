import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { BaseError, ServiceError } from '../exceptions';
import { isError } from './../utils/error';


type PrismaErrors = 'P2002' | 'P2023'

const ErrorMessages: Record<PrismaErrors, string> = Object.freeze({
	P2002: 'Unique constraint failed',
	P2023: 'Inconsistent column data',
})


const handlePrismaKnownError = (error: PrismaClientKnownRequestError): BaseError => {
	switch (error.code) {
		case 'P2002': {
			return ServiceError.createBadRequestError(ErrorMessages[error.code], JSON.stringify(error.meta))
		}
		case 'P2023': {
			return ServiceError.createBadRequestError(ErrorMessages[error.code], JSON.stringify(error.meta))
		}
		default: {
			return ServiceError.createInternalServerError(error, JSON.stringify(error.meta))
		}
	}
}

export const handlePrismaError = (error: unknown): BaseError => {
	if (!isError(error)) {
		return ServiceError.createInternalServerError(new Error(), 'Unknown error')
	}

	switch (error.constructor) {
		case PrismaClientKnownRequestError: {
			return handlePrismaKnownError(error as PrismaClientKnownRequestError)
		}
		default: {
			return ServiceError.createInternalServerError(error, error.message)
		}
	}
}
