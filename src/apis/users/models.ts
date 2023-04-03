import { User } from '@prisma/client';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { IsDefined, IsEmail, IsPostalCode } from 'class-validator';
import { BaseResponse } from '../types';
import { hashPassword } from '../../utils/security';

export type Params = {
	entityId: string,
	[key: string]: string
}

export type UserDTO = User

export type GetAllResponse = BaseResponse<User[]>
export type GetResponse = BaseResponse<User>

export class SearchRequest {
	@IsDefined()
	@Expose()
	@IsEmail()
	readonly email!: string
}

export class RegisterUserRequest {
	@IsDefined()
	@Expose()
	@IsEmail()
	readonly email!: string

	@IsDefined()
	@Expose()
	@Transform(({ value }) => hashPassword(value))
	readonly password!: string


	// TODO: move to middleware
	static fromBody(body: RegisterUserRequest): RegisterUserRequest {
		return plainToInstance(RegisterUserRequest, body)
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

export class ChangeEmailRequest {
	@IsDefined()
	@Expose()
	@IsEmail()
	readonly newEmail!: string

	// TODO: move to middleware
	static fromBody(body: ChangeEmailRequest): ChangeEmailRequest {
		return plainToInstance(ChangeEmailRequest, body)
	}
}

export class EditProfileRequest {
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
	static fromBody(body: EditProfileRequest): EditProfileRequest {
		return plainToInstance(EditProfileRequest, body)
	}
}

