import { PrismaClient } from '@prisma/client'

const getDatabaseConnection = async (): Promise<PrismaClient> => {
	try {
		const prisma = new PrismaClient()
		await prisma.$connect()
		return prisma
	} catch (error) {
		throw error
	}
}


export { getDatabaseConnection }