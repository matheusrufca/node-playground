import { User } from '@prisma/client';
import { Body, Get, Path, Post, Route } from "tsoa";
import { ServiceError } from '../../exceptions';
import { UserRepository } from '../../repositories';
import { BaseResponse } from '../types';

type GetAllResponse = BaseResponse<User[]>
type GetResponse = BaseResponse<User>

export type SearchRequest = { email: string }

@Route("users")
export default class UserController {
	@Get("/")
	public async getAll(): Promise<GetAllResponse> {
		const result = await UserRepository.getAll()
		return {
			content: result
		}
	}

	@Get("/{entityId}")
	public async getById(@Path() entityId: string): Promise<GetResponse> {
		const result = await UserRepository.getById(entityId)

		if (!result) throw ServiceError.createNotFoundError('User not found')

		return {
			content: result
		}
	}

	@Post("/search")
	public async getByEmail(@Body() { email }: SearchRequest): Promise<GetResponse> {
		const result = await UserRepository.getByEmail(email)

		if (!result) throw ServiceError.createNotFoundError('User not found')
		
		return {
			content: result
		}
	}
}