import { User } from '@prisma/client';
import { Expose, plainToInstance } from 'class-transformer';
import { IsDefined } from 'class-validator';

export type Params = Record<string, string>

export type UserDTO = User

export class AuthTokenRequest {
	@IsDefined()
	@Expose()
	readonly email!: string

	@IsDefined()
	@Expose()
	readonly password!: string

	static fromBody(body: AuthTokenRequest): AuthTokenRequest {
		return plainToInstance(AuthTokenRequest, body)
	}
}

export type AuthTokenResponse = {
	accessToken: string
}