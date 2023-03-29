import { StatusCodes } from 'http-status-codes'
import { Body, Get, Patch, Path, Post, Put, Response, Route, SuccessResponse } from 'tsoa'

import { ErrorService, NotFoundError, UnprocessableEntityError } from '../../exceptions'
import { UserRepository } from '../../repositories'
import { comparePassword } from '../../utils/hash'
import {
	ChangeEmail,
	ChangePassword,
	EditProfile,
	GetAllResponse,
	GetResponse,
	RegisterUser,
	SearchRequest,
	UserDTO
} from './models'


@Route('users')
export default class UserController {
	@Get('/')
	async getAll(): Promise<GetAllResponse> {
		const result = await UserRepository.getAll()
		return {
			content: result
		}
	}

	@Get('/{entityId}')
	@Response<NotFoundError>(StatusCodes.NOT_FOUND, 'Not found')
	async getById(@Path() entityId: string): Promise<GetResponse> {
		const result = await UserRepository.getById(entityId)

		if (!result) throw ErrorService.createNotFoundError('User not found')

		return {
			content: result
		}
	}

	@Post('/search')
	@Response<NotFoundError>(StatusCodes.NOT_FOUND, 'Not found')
	async getByEmail(@Body() { email }: SearchRequest): Promise<GetResponse> {
		const result = await UserRepository.getByEmail(email)

		if (!result) throw ErrorService.createNotFoundError('User not found')

		return {
			content: result
		}
	}

	@Post('/register')
	@SuccessResponse(StatusCodes.CREATED, 'Created')
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	async register(@Body() body: RegisterUser): Promise<void> {
		// TODO: move to middleware
		const { email, password } = RegisterUser.fromBody(body)
		const user = await UserRepository.getByEmail(email)

		this.validateEmailNotTaken(email, user)

		await UserRepository.create({
			email,
			password,
		})
	}

	@Patch('/{entityId}/change-password')
	@SuccessResponse(StatusCodes.OK)
	@Response<UnprocessableEntityError>(StatusCodes.NOT_FOUND)
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	async changePassword(
		@Path() entityId: string,
		@Body() body: ChangePassword
	): Promise<void> {
		// TODO: move to middleware
		const { currentPassword, newPassword } = ChangePassword.fromBody(body)
		const user = await UserRepository.getById(entityId)

		this.validateUserExist(user)
		this.validateCurrentPassword(currentPassword, user?.password || '')

		await UserRepository.updateWithId(entityId, {
			data: {
				password: newPassword,
			},
			select: {
				password: true,
			},
		})
	}

	@Patch('/{entityId}/change-email')
	@SuccessResponse(StatusCodes.OK)
	@Response<UnprocessableEntityError>(StatusCodes.NOT_FOUND)
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	async changeEmail(
		@Path() entityId: string,
		@Body() body: ChangeEmail
	): Promise<void> {
		// TODO: move to middleware
		const { newEmail } = ChangeEmail.fromBody(body)
		const user = await UserRepository.getById(entityId)

		this.validateUserExist(user)

		await UserRepository.updateWithId(entityId, {
			data: {
				email: newEmail,
			},
			select: {
				email: true,
			},
		})
	}

	@Put('/{entityId}/profile')
	@SuccessResponse(StatusCodes.OK)
	@Response<UnprocessableEntityError>(StatusCodes.NOT_FOUND)
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	async editProfile(
		@Path() entityId: string,
		@Body() body: EditProfile
	): Promise<void> {
		// TODO: move to middleware
		const profile = EditProfile.fromBody(body)
		const user = await UserRepository.getById(entityId)
		const currentProfile = user?.profile || {}

		this.validateUserExist(user)

		await UserRepository.updateWithId(entityId, {
			data: {
				profile: {
					...currentProfile,
					...profile,
				},
			},
			select: {
				profile: true,
			},
		})
	}

	private validateCurrentPassword(password: string, storedHash: string): void {
		if (!comparePassword(password, storedHash))
			throw ErrorService.createUnauthorizedError('Invalid password')
	}

	private validateUserExist(user?: UserDTO | null): void {
		if (!user)
			throw ErrorService.createNotFoundError('User not found')
	}

	private validateEmailNotTaken(email: string, user?: UserDTO | null): void {
		if (user && user.email === email)
			throw ErrorService.createUnprocessableEntityError('Email already taken')
	}
}