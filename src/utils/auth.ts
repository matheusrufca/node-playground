import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import { JwtPayload, verify as verifyToken } from 'jsonwebtoken'

import { ErrorService } from './../exceptions/index'

type TokenResult = string | JwtPayload | undefined

export const hashPassword = (password: string): string =>
	hashSync(password, genSaltSync(8))

export const comparePassword = (password: string, storedHash: string) =>
	compareSync(password, storedHash)

export const validateToken = (token: string): Promise<TokenResult> => {
	return new Promise((resolve, reject) => {
		const tokenSecret = process.env.ACCESS_TOKEN_SECRET || ''
		verifyToken(token, tokenSecret, (error, user) => {
			if (error) {
				reject(
					ErrorService.createUnauthorizedError('An error ocurred when validating token',
						error.message,
						error
					))
			}
			resolve(user)
		})
	})
}
