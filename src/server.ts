import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express, { Application, NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import path from 'path'
import swagger from 'swagger-ui-express'

import swaggerConfig from '../public/swagger.json'
import routes from './apis/routes'
import { apiErrorHandler } from './config/api-error-handler'
import logger from './config/logger'

const BASE_URL = [process.env.API_BASE_PATH, process.env.API_VERSION].join('/')
const PORT = process.env.PORT || 8000

const app: Application = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
	[`${BASE_URL}/docs`, `${BASE_URL}/swagger`],
	swagger.serve,
	swagger.setup(swaggerConfig, undefined, {
		basePath: BASE_URL
	})
)

app.use(BASE_URL, routes)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(createError.NotFound()))
})

// error handler
app.use(apiErrorHandler)



app.use(function (error: Error, req: Request, res: Response, next: NextFunction) {
	// // set locals, only providing error in development
	// res.locals.message = err.message
	// res.locals.error = req.app.get('env') === 'development' ? err : {}

	// // render the error page
	// res.status((err as any).status || 500)
	// res.render('error')
})

app.listen(PORT, () => {
	console.log("Server is running on port", PORT)
})

export default app
export { app }

