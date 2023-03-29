import { User } from '@prisma/client';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { IsDefined, IsEmail, IsPostalCode } from 'class-validator';
import { BaseResponse } from '../types';
import { hashPassword } from './../../utils/hash';

export type Params = {
	entityId: string,
	[key: string]: string
}

export type UserDTO = User

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


	// TODO: move to middleware
	static fromBody(body: RegisterUser): RegisterUser {
		return plainToInstance(RegisterUser, body)
	}
}

export class ChangePassword {
	@IsDefined()
	@Expose()
	// @Transform(({ value }) => hashPassword(value))
	readonly currentPassword!: string

	@IsDefined()
	@Expose()
	@Transform(({ value }) => hashPassword(value))
	readonly newPassword!: string

	// TODO: move to middleware
	static fromBody(body: ChangePassword): ChangePassword {
		return plainToInstance(ChangePassword, body)
	}
}

export class ChangeEmail {
	@IsDefined()
	@Expose()
	@IsEmail()
	readonly newEmail!: string

	// TODO: move to middleware
	static fromBody(body: ChangeEmail): ChangeEmail {
		return plainToInstance(ChangeEmail, body)
	}
}

export class EditProfile {
	@Expose()
	readonly name?: string

	@Expose()
	readonly bio?: string

	@Expose()
	readonly website?: string

	@Expose()
	readonly city?: string

	@Expose()
	readonly state?: string

	@Expose()
	readonly country?: string

	@Expose()
	@IsPostalCode('US')
	readonly postalCode?: string

	// TODO: move to middleware
	static fromBody(body: EditProfile): EditProfile {
		return plainToInstance(EditProfile, body)
	}
}

