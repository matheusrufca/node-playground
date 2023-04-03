import { User } from '@prisma/client';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { IsDefined, IsEmail, IsPostalCode } from 'class-validator';
import { BaseResponse } from '../types';
import { hashPassword } from './../../utils/hash';

export type Params = Record<string, string>

export type UserDTO = User

export class AuthTokenRequest {
	@IsDefined()
	@Expose()
	readonly email!: string

	@IsDefined()
	@Expose()
	@Transform(({ value }) => hashPassword(value))
	readonly password!: string

	static fromBody(body: AuthTokenRequest): AuthTokenRequest {
		return plainToInstance(AuthTokenRequest, body)
	}
}

export type AuthTokenResponse = {
	accessToken: string
}