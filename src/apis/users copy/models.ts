import { User } from '@prisma/client'
import { Expose } from 'class-transformer'
import { IsDefined, IsEmail } from 'class-validator'
import { BaseResponse } from '../types'

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