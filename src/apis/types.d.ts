export type BaseResponse<T extends {}> = {
	content: T
}

export type ResponseError = {
	code: string
	message: string
	description?: string
}