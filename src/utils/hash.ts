import { compareSync, genSaltSync, hashSync } from 'bcrypt'

export const hashPassword = (password: string): string =>
	hashSync(password, genSaltSync(8))

export const comparePassword = (password: string, storedHash: string) =>
	compareSync(password, storedHash)
