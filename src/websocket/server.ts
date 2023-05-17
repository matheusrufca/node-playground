import { IncomingMessage } from 'http'
import { RawData, Server, ServerOptions, WebSocket, WebSocketServer } from 'ws'



export type WebSocketServerOptions = ServerOptions

export interface WebSocketServerHandlers<T extends WebSocket = WebSocket> {
	onConnection?: (this: Server<T>, socket: T, request: IncomingMessage) => void
	onError?: (this: WebSocket, err: Error) => void
	onClose?: (this: WebSocket, code: number, reason: Buffer) => void
	onMessage?: (this: WebSocket, data: RawData, isBinary: boolean) => void
}

const PORT: number = parseInt(process.env.WEBSOCKET_PORT ?? '8080', 10)
const DEFAULT_OPTIONS = Object.freeze<WebSocketServerOptions>({
	port: PORT,
	// noServer: true,
})


const createWebSocketServer = (options?: WebSocketServerOptions, handlers?: WebSocketServerHandlers) => {
	const server = new WebSocketServer({
		...DEFAULT_OPTIONS,
		...options,
		path: '/chat'
	})

	handlers?.onConnection && server.on('connection', handlers.onConnection)

	server.on('connection', (socket) => {
		console.debug('ws:connection', 'Adding event listeners')

		handlers?.onError && socket.on('error', handlers.onError)
		handlers?.onMessage && socket.on('message', handlers.onMessage)
		handlers?.onClose && socket.on('close', handlers.onClose)
	})

	console.debug('Websocket server running', {
		port: PORT,
		path: options?.path,
	})

	return server
}


export { createWebSocketServer }

