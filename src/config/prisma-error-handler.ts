import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { BaseError, ServiceError } from '../exceptions';
import { isError } from './../utils/error';


const handlePrismaKnownError = (error: PrismaClientKnownRequestError): BaseError => {
	switch (error.code) {
		case 'P2023': {
			return ServiceError.createBadRequestError('Prisma client error', JSON.stringify(error.meta))
		}
		default: {
			return ServiceError.createInternalServerError(error, JSON.stringify(error.meta))
		}
	}
}

export const handlePrismaError = (error: unknown): BaseError => {
	if (!isError(error))
		return ServiceError.createInternalServerError(new Error(), 'Unknown error')

	switch (error.constructor) {
		case PrismaClientKnownRequestError: {
			return handlePrismaKnownError(error as PrismaClientKnownRequestError)
		}
		default: {
			return ServiceError.createInternalServerError(error, error.message)
		}
	}
}
