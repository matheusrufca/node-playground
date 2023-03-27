import { Prisma, PrismaClient, User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { handlePrismaError } from '../config/prisma-error-handler'
import { getDatabaseConnection } from '../database'
import { now } from '../utils/date'



export const create = async (data: Prisma.UserCreateInput) => {
	let database: PrismaClient | undefined
	try {
		database = await getDatabaseConnection()
		return await database.user.create({
			data,
		})
	} catch (error) {
		throw handlePrismaError(error)
	}
	finally {
		await database?.$disconnect()
	}
}

export const getAll = async (options?: Prisma.UserFindManyArgs): Promise<User[]> => {
	let database: PrismaClient | undefined
	try {
		database = await getDatabaseConnection()
		const data = await database.user.findMany(options)
		return data
	} catch (error) {
		throw handlePrismaError(error)
	}
	finally {
		await database?.$disconnect()
	}
}

export const get = async (options: Prisma.UserFindUniqueArgs): Promise<User | null> => {
	let database: PrismaClient | undefined
	try {
		database = await getDatabaseConnection()
		const data = await database.user.findUnique(options)
		return data
	} catch (error) {
		throw handlePrismaError(error)
	}
	finally {
		await database?.$disconnect()
	}
}

export const getByEmail = async (email: string, options?: Prisma.UserFindUniqueArgs): Promise<User | null> => {
	return get({
		...options,
		where: {
			email,
			...options?.where
		},
	})
}

export const getById = async (id: string, options?: Prisma.UserFindUniqueArgs): Promise<User | null> => {
	return get({
		...options,
		where: {
			id,
			...options?.where
		},
	})
}

export const update = async (email: string, data: Prisma.UserUpdateArgs) => {
	let database: PrismaClient | undefined
	try {
		database = await getDatabaseConnection()

		data.data.updatedAt = now()

		return await database.user.update({
			...data,
			where: {
				email,
			}
		})
	} catch (error) {
		throw handlePrismaError(error)
	}
	finally {
		await database?.$disconnect()
	}
}

export const upsert = async (email: string, data: Omit<Prisma.UserUpsertArgs, 'where'>) => {
	let database: PrismaClient | undefined
	try {
		database = await getDatabaseConnection()

		const model: Prisma.UserUpsertArgs = {
			...data,
			update: {
				...data.update,
				updatedAt: now(),
			},
			where: {
				email,
			}
		}
		return await database.user.upsert(model)
	} catch (error) {
		throw handlePrismaError(error)
	}
	finally {
		await database?.$disconnect()
	}
}

export const remove = async (data: Prisma.UserDeleteArgs) => {
	let database: PrismaClient | undefined
	try {
		database = await getDatabaseConnection()
		return await database.user.delete(data)
	} catch (error) {
		throw handlePrismaError(error)
	}
	finally {
		await database?.$disconnect()
	}
}

export const removeByEmail = async (email: string, options?: Prisma.UserDeleteArgs) => {
	return await remove({
		where: {
			email,
			...options?.where,
		},
		...options,
	})
}

export const removeById = async (id: string, options?: Prisma.UserDeleteArgs) => {
	return await remove({
		where: {
			id,
			...options?.where,
		},
		...options,
	})
}


export default {
	create,
	get,
	getByEmail,
	getById,
	getAll,
	update,
	upsert,
	remove,
	removeByEmail,
	removeById,
}

