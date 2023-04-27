import { PrismaClient } from '@prisma/client'
import { handlePrismaError } from '../config/prisma-error-handler'

const getDatabaseConnection = async (): Promise<PrismaClient> => {
	try {
		const prisma = new PrismaClient()
		await prisma.$connect()
		return prisma
	} catch (error) {
		throw error
	}
}


type DbOperation<T extends {}> = (database: PrismaClient) => T
type DbOperationResult<T extends {}> = ReturnType<DbOperation<T>>

const makeOperation = async <T extends {}>(operation: DbOperation<T>): Promise<DbOperationResult<T>> => {
	let database: PrismaClient | undefined
	try {
		database = await getDatabaseConnection()
		return await operation(database)
	} catch (error) {

		console.error(error)

		throw handlePrismaError(error)
	}
	finally {
		await database?.$disconnect()
	}
}


export {
	getDatabaseConnection,
	makeOperation,
}

