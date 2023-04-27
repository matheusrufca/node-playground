import { Prisma } from '@prisma/client'
import { makeOperation } from '../database'


export const create = async (data: Prisma.MenuCreateInput) => {
	return makeOperation(async (database) =>
		await database.menu.create({ data, }))
}

export const createMany = async (data: Prisma.MenuCreateInput[]) => {
	return makeOperation(async (database) =>
		await database.menu.createMany({ data, }))
}


export default {
	create,
	createMany,
}

