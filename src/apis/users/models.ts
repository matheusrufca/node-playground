import { User } from '@prisma/client';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { IsDefined, IsEmail } from 'class-validator';
import { BaseResponse } from '../types';
import { hashPassword } from './../../utils/hash';

export type Params = {
	entityId: string,
	[key: string]: string
}

export type GetAllResponse = BaseResponse<User[]>
export type GetResponse = BaseResponse<User>

export type SearchRequest = { email: string }

export class CreateUserRequest {
	@IsDefined()
	@Expose()
	@IsEmail()
	email!: string

	@IsDefined()
	@Expose()
	name!: string
}

export type EditUserRequest = {
	email: string
	name: string
}

export type UpsertUserRequest = {
	email: string
	name: string
}


export class RegisterUser {
	@IsDefined()
	@Expose()
	@IsEmail()
	readonly email!: string

	@IsDefined()
	@Expose()
	@Transform(({ value }) => hashPassword(value))
	readonly password!: string

	@Expose()
	getPasswordHash(): string {
		return hashPassword(this.password)
	}


	// TODO: move to middleware
	static fromBody(body: RegisterUser): RegisterUser {
		return plainToInstance(RegisterUser, body)
	}
}