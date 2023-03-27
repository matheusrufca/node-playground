import { StatusCodes } from 'http-status-codes';
import { Body, Get, Path, Post, Route, SuccessResponse } from "tsoa";
import { ServiceError } from '../../exceptions';
import { UserRepository } from '../../repositories';
import {
	CreateUserRequest,
	GetAllResponse,
	GetResponse,
	SearchRequest,
} from './models';


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

	@Post("/")
	@SuccessResponse(StatusCodes.CREATED, "Created")
	public async create(@Body() { email, name }: CreateUserRequest): Promise<void> {
		await UserRepository.create({
			email,
			name
		})
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