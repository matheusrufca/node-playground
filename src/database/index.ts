import { PrismaClient } from '@prisma/client'
import { handlePrismaError } from '../config/prisma-error-handler'

type DbTransactionFn<TResult> = (database: PrismaClient) => Promise<TResult>

const getDatabaseClient = (): PrismaClient => new PrismaClient()

const runTransaction = async <TResult>(transactionFn: DbTransactionFn<TResult>): ReturnType<DbTransactionFn<TResult>> => {
	try {
		const database = getDatabaseClient()
		return await transactionFn(database)
	}
	catch (error) {
		throw handlePrismaError(error)
	}
}


export {
	getDatabaseClient,
	runTransaction,
}

