import { User } from '@prisma/client';
import { Get, Route } from "tsoa";
import { UserRepository } from '../../repositories';
import { BaseResponse } from '../types';

type GetAllResponse = BaseResponse<User[]>

@Route("users")
export default class UserController {
	@Get("/")
	public async getAll(): Promise<GetAllResponse> {
		try {
			const users = await UserRepository.getAll()
			return {
				content: users
			}
		} catch (error) {
			throw error
		}
	}
}