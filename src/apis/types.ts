
export interface IRequest<T> extends Express.Request {
	body: T
}



export type BaseResponse<T extends {}> = {
	content: T
}