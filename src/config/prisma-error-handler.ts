import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { HttpBaseError, ErrorService } from '../exceptions';
import { isError } from './../utils/error';


type PrismaErrors = 'P2002' | 'P2023'

const ErrorMessages: Record<PrismaErrors, string> = Object.freeze({
	P2002: 'Unique constraint failed',
	P2023: 'Inconsistent column data',
})


const handlePrismaKnownError = (error: PrismaClientKnownRequestError): HttpBaseError => {
	switch (error.code) {
		case 'P2002': {
			return ErrorService.createBadRequestError(ErrorMessages[error.code], JSON.stringify(error.meta))
		}
		case 'P2023': {
			return ErrorService.createBadRequestError(ErrorMessages[error.code], JSON.stringify(error.meta))
		}
		default: {
			return ErrorService.createInternalServerError(error, JSON.stringify(error.meta))
		}
	}
}

export const handlePrismaError = (error: unknown): HttpBaseError => {
	if (!isError(error)) {
		return ErrorService.createInternalServerError(new Error(), 'Unknown error')
	}

	switch (error.constructor) {
		case PrismaClientKnownRequestError: {
			return handlePrismaKnownError(error as PrismaClientKnownRequestError)
		}
		default: {
			return ErrorService.createInternalServerError(error, error.message)
		}
	}
}
