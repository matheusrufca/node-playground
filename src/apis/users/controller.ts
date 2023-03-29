import { StatusCodes } from 'http-status-codes'
import { Body, Get, Path, Post, Response, Route, SuccessResponse } from 'tsoa'

import { ErrorService, NotFoundError, UnprocessableEntityError } from '../../exceptions'
import { UserRepository } from '../../repositories'
import { hashPassword } from '../../utils/hash'
import {
	GetAllResponse,
	GetResponse,
	RegisterUser,
	SearchRequest
} from './models'


@Route('users')
export default class UserController {
	@Get('/')
	public async getAll(): Promise<GetAllResponse> {
		const result = await UserRepository.getAll()
		return {
			content: result
		}
	}

	@Get('/{entityId}')
	@Response<NotFoundError>(StatusCodes.NOT_FOUND, 'Not found')
	public async getById(@Path() entityId: string): Promise<GetResponse> {
		const result = await UserRepository.getById(entityId)

		if (!result) throw ErrorService.createNotFoundError('User not found')

		return {
			content: result
		}
	}

	@Post('/search')
	@Response<NotFoundError>(StatusCodes.NOT_FOUND, 'Not found')
	public async getByEmail(@Body() { email }: SearchRequest): Promise<GetResponse> {
		const result = await UserRepository.getByEmail(email)

		if (!result) throw ErrorService.createNotFoundError('User not found')

		return {
			content: result
		}
	}

	@Post('/register')
	@SuccessResponse(StatusCodes.CREATED, 'Created')
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	public async register(@Body() body: RegisterUser): Promise<void> {
		const result = await UserRepository.getByEmail(body.email)
		if (result)
			throw ErrorService.createUnprocessableEntityError('Email already taken')

		// TODO: move to middleware
		const { email, password } = RegisterUser.fromBody(body)

		await UserRepository.create({
			email,
			password,
		})

	}
}