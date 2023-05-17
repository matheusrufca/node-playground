import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import path from 'path'
import swagger from 'swagger-ui-express'

import routes from './apis/routes'
import { apiErrorHandler } from './config/api-error-handler'
import logger from './config/logger'
import { swaggerConfigHandler } from './config/swagger-config'
import ChatServer from './websocket/chat-server'

const BASE_URL = [process.env.API_BASE_PATH, process.env.API_VERSION].join('/')
const API_PORT = process.env.PORT || 8000


const app: Application = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
	origin: '*'
}));



app.use(
	[`${BASE_URL}/docs`, `${BASE_URL}/swagger`],
	swagger.serve,
	swaggerConfigHandler
)

app.use(BASE_URL, routes)


// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(createError.NotFound('Route not found')))
})

// error handler
app.use(apiErrorHandler)


app.use((req: Request, res: Response, next) => {
	// handle websocket
	// handleConnectionUpgrade(req, res)
})


app.use(function (error: Error, req: Request, res: Response, next: NextFunction) {
	// // set locals, only providing error in development
	// res.locals.message = err.message
	// res.locals.error = req.app.get('env') === 'development' ? err : {}

	// // render the error page
	// res.status((err as any).status || 500)
	// res.render('error')
})


app
	.listen(API_PORT, () => {
		console.log("HTTP server is running on port", API_PORT)
		ChatServer.start()
	})



export default app
export { app }

