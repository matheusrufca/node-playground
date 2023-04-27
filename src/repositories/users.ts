import { Prisma, User } from '@prisma/client'
import { runTransaction } from '../database'
import { now } from '../utils/date'



export const create = async (data: Prisma.UserCreateInput) => {
	return await runTransaction(async (database) =>
		await database.user.create({ data, }))
}

export const getAll = async (options?: Prisma.UserFindManyArgs): Promise<User[]> => {
	return await runTransaction(async (database) =>
		await database.user.findMany(options))
}

export const get = async (options: Prisma.UserFindUniqueArgs) => {
	return await runTransaction(async (database) =>
		await database.user.findUnique(options)
	)
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


export const update = async (data: Prisma.UserUpdateArgs) => {
	return await runTransaction(async (database) =>
		await database.user.update({
			...data,
			data: {
				...data.data,
				updatedAt: now(),
			},
		})
	)
}

export const updateWithId = async (id: string, data: Omit<Prisma.UserUpdateArgs, 'where'>) => {
	return await update({
		...data,
		where: {
			id,
		},
	})
}


export const upsert = async (data: Prisma.UserUpsertArgs) => {
	return await runTransaction(async (database) => {
		const model: Prisma.UserUpsertArgs = {
			...data,
			update: {
				...data.update,
				updatedAt: now(),
			},
		}
		return await database.user.upsert(model)
	}
	)
}

export const upsertWithId = async (id: string, data: Omit<Prisma.UserUpsertArgs, 'where'>) => {
	const model: Prisma.UserUpsertArgs = {
		...data,
		where: {
			id,
		}
	}

	return await upsert(model)
}


export const remove = async (data: Prisma.UserDeleteArgs) => {
	return await runTransaction(async (database) =>
		await database.user.delete(data)
	)
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

