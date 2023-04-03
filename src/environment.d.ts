import { JwtPayload } from 'jsonwebtoken'

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ACCESS_TOKEN_SECRET: string
			REFRESH_TOKEN_SECRET: string
			API_BASE_PATH: string
			API_PORT: string
			API_VERSION: string
			DATABASE_URL: string
		}
	}
	namespace Express {
		export interface Request {
			language?: Language;
			user?: string | JwtPayload;
		}
	}
}
export { }