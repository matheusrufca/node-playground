import { StatusCodes } from 'http-status-codes'
import { Body, Get, Patch, Path, Post, Put, Response, Route, Security, SuccessResponse } from 'tsoa'

import { ErrorService, NotFoundError, UnprocessableEntityError } from '../../exceptions'
import { UserRepository } from '../../repositories'
import { comparePassword } from '../../utils/security'
import {
	ChangeEmailRequest,
	ChangePasswordRequest,
	EditProfileRequest,
	GetAllUsersResponse,
	GetUserResponse,
	RegisterUserRequest,
	SearchRequest,
	UserDTO
} from './models'


@Route('users')
export class UserController {
	@Get('/')
	async getAll(): Promise<GetAllUsersResponse> {
		const result = await UserRepository.getAll()
		return {
			content: result
		}
	}

	@Get('/{entityId}')
	@Security('bearerAuth')
	@Response<NotFoundError>(StatusCodes.NOT_FOUND, 'Not found')
	async getById(@Path() entityId: string): Promise<GetUserResponse> {
		const result = await UserRepository.getById(entityId)

		if (!result) throw ErrorService.createNotFoundError('User not found')

		return {
			content: result
		}
	}

	@Post('/search')
	@Security('bearerAuth')
	@Response<NotFoundError>(StatusCodes.NOT_FOUND, 'Not found')
	async getByEmail(@Body() { email }: SearchRequest): Promise<GetUserResponse> {
		const result = await UserRepository.getByEmail(email)

		if (!result) throw ErrorService.createNotFoundError('User not found')

		return {
			content: result
		}
	}

	@Post('/register')
	@SuccessResponse(StatusCodes.CREATED, 'Created')
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	async register(@Body() body: RegisterUserRequest): Promise<void> {
		// TODO: move to middleware
		const { email, password } = RegisterUserRequest.fromBody(body)
		const user = await UserRepository.getByEmail(email)

		this.validateEmailNotTaken(email, user)

		await UserRepository.create({
			email,
			password,
		})
	}

	@Patch('/{entityId}/change-password')
	@Security('bearerAuth')
	@SuccessResponse(StatusCodes.OK)
	@Response<UnprocessableEntityError>(StatusCodes.NOT_FOUND)
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	async changePassword(
		@Path() entityId: string,
		@Body() body: ChangePasswordRequest
	): Promise<void> {
		// TODO: move to middleware
		const { currentPassword, newPassword } = ChangePasswordRequest.fromBody(body)
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
	@Security('bearerAuth')
	@SuccessResponse(StatusCodes.OK)
	@Response<UnprocessableEntityError>(StatusCodes.NOT_FOUND)
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	async changeEmail(
		@Path() entityId: string,
		@Body() body: ChangeEmailRequest
	): Promise<void> {
		// TODO: move to middleware
		const { newEmail } = ChangeEmailRequest.fromBody(body)
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
	@Security('bearerAuth')
	@SuccessResponse(StatusCodes.OK)
	@Response<UnprocessableEntityError>(StatusCodes.NOT_FOUND)
	@Response<UnprocessableEntityError>(StatusCodes.UNPROCESSABLE_ENTITY)
	async editProfile(
		@Path() entityId: string,
		@Body() body: EditProfileRequest
	): Promise<void> {
		// TODO: move to middleware
		const profile = EditProfileRequest.fromBody(body)
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