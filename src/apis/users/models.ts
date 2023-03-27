import { User } from '@prisma/client';
import { BaseResponse } from '../types';

export type GetAllResponse = BaseResponse<User[]>
export type GetResponse = BaseResponse<User>

export type SearchRequest = { email: string }

export type CreateUserRequest = {
	email: string
	name: string
}