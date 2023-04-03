import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import { JwtPayload, sign, verify as verifyToken } from 'jsonwebtoken'

import { ErrorService } from './../exceptions/index'

type UserIdentity = {
	id: string
	email: string
}

export type TokenResult = JwtPayload & UserIdentity

export const hashPassword = (password: string): string =>
	hashSync(password, genSaltSync(8))

export const comparePassword = (password: string, storedHash: string): boolean =>
	compareSync(password, storedHash)

export const generateAccessToken = (user: UserIdentity) => {
	const tokenSecret = process.env.ACCESS_TOKEN_SECRET || ''
	return sign({ id: user.id, email: user.email }, tokenSecret, { expiresIn: '1y', })
}

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
			resolve(user as TokenResult)
		})
	})
}

export const validateUserIdentity = async (token: string, userId: string) => {
	const user = await validateToken(token)

	if (user.id !== userId)
		throw ErrorService.createForbiddenError('User not allowed to make this operation')
}