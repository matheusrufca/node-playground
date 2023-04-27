import { Prisma } from '@prisma/client'
import { runTransaction } from '../database'


export const create = async (data: Prisma.MenuCreateInput) => {
	return await runTransaction(async (database) =>
		await database.menu.create({ data, }))
}

export const createMany = async (data: Prisma.MenuCreateInput[]) => {
	return await runTransaction(async (database) =>
		await database.menu.createMany({ data, }))
}


export default {
	create,
	createMany,
}

