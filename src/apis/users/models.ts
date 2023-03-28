import { User } from '@prisma/client'
import { BaseResponse } from '../types'

export type Params = {
	entityId: string,
	[key: string]: string
}

export type GetAllResponse = BaseResponse<User[]>
export type GetResponse = BaseResponse<User>

export type SearchRequest = { email: string }

export type CreateUserRequest = {
	email: string
	name: string
}

export type EditUserRequest = {
	email: string
	name: string
}

export type UpsertUserRequest = {
	email: string
	name: string
}