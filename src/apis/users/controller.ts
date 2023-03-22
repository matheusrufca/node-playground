import { User } from '@prisma/client';
import { Body, Get, Path, Post, Query, Route } from "tsoa";
import { UserRepository } from '../../repositories';
import { BaseResponse } from '../types';

type GetAllResponse = BaseResponse<User[]>
type GetResponse = BaseResponse<User>

export type SearchRequest = { email: string }

@Route("users")
export default class UserController {
	@Get("/")
	public async getAll(): Promise<GetAllResponse> {
		try {
			const result = await UserRepository.getAll()
			return {
				content: result
			}
		} catch (error) {
			throw error
		}
	}

	@Get("/{entityId}")
	public async getById(@Path() entityId: string): Promise<GetResponse> {
		try {
			const result = await UserRepository.getById(entityId)

			if (!result) throw new Error('User not found')

			return {
				content: result
			}
		} catch (error) {
			throw error
		}
	}

	@Post("/search")
	public async getByEmail(@Body() { email }: SearchRequest): Promise<GetResponse> {
		try {
			const result = await UserRepository.getByEmail(email)

			if (!result) throw new Error('User not found')

			return {
				content: result
			}
		} catch (error) {
			throw error
		}
	}
}