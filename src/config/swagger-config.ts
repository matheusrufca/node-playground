import { RequestHandler } from 'express'
import { SwaggerOptions } from 'swagger-ui-express'
import swagger from 'swagger-ui-express'

import swaggerConfig from '../../public/swagger.json'

const BASE_URL = [process.env.API_BASE_PATH, process.env.API_VERSION].join('/')

const swaggerOptions: SwaggerOptions = {
	basePath: BASE_URL,
}

export const swaggerConfigHandler: RequestHandler = swagger.setup(
	swaggerConfig,
	undefined,
	swaggerOptions
)