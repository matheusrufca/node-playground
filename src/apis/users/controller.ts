import { StatusCodes } from 'http-status-codes'
import { Body, Get, Patch, Path, Post, Put, Route, SuccessResponse } from "tsoa"

import { ServiceError } from '../../exceptions'
import { UserRepository } from '../../repositories'
import { CreateUserRequest, EditUserRequest, GetAllResponse, GetResponse, SearchRequest, UpsertUserRequest } from './models'


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

	@Patch("/{entityId}")
	@SuccessResponse(StatusCodes.NO_CONTENT, "No Content")
	public async editWithId(
		@Path() entityId: string,
		@Body() { email, name }: EditUserRequest
	): Promise<void> {
		await UserRepository.updateWithId(entityId, {
			data: {
				email,
				name
			}
		})
	}

	@Put("/{entityId}")
	@SuccessResponse(StatusCodes.NO_CONTENT, "No Content")
	public async upsert(
		@Path() entityId: string,
		@Body() { email, name }: UpsertUserRequest): Promise<void> {

		await UserRepository.upsertWithId(entityId, {
			create: {
				email,
				name,
			},
			update: {
				email,
				name,
			},
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