import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { Body, Post, Response, Route, SuccessResponse } from 'tsoa'

import { ErrorService, UnauthorizedError } from '../../exceptions'
import { UserRepository } from '../../repositories'
import { comparePassword } from '../../utils/auth'
import { AuthTokenRequest, AuthTokenResponse, UserDTO } from './models'

@Route('auth')
export class AuthController {

	@Post('/token')
	@SuccessResponse(StatusCodes.OK)
	@Response<UnauthorizedError>(StatusCodes.UNAUTHORIZED)
	async authenticate(@Body() body: AuthTokenRequest): Promise<AuthTokenResponse> {
		const { email, password } = AuthTokenRequest.fromBody(body)
		const user = await UserRepository.getByEmail(email)

		this.validateUserExist(user)
		this.validateCurrentPassword(password, user?.password || '')

		const accessToken = this.generateAccessToken(user!)

		return { accessToken }
	}

	private generateAccessToken(user: UserDTO): string {
		const tokenSecret = process.env.ACCESS_TOKEN_SECRET || ''
		return jwt.sign(user, tokenSecret, { expiresIn: '1y', })
	}

	private validateUserExist(user?: UserDTO | null): void {
		if (!user)
			throw ErrorService.createNotFoundError('User not found')
	}

	private validateCurrentPassword(password: string, storedHash: string): void {
		if (!comparePassword(password, storedHash))
			throw ErrorService.createUnauthorizedError('Invalid password')
	}
}