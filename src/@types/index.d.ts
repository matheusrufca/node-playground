
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly ACCESS_TOKEN_SECRET: string
			readonly REFRESH_TOKEN_SECRET: string
			readonly API_BASE_PATH: string
			readonly API_PORT: string
			readonly API_VERSION: string
			readonly DATABASE_URL: string
			readonly WEBSOCKET_PORT: string
		}
	}
}
export { }

