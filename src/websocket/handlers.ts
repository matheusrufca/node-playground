import { Request, Response } from 'express'

export const handleConnectionUpgrade = (request: Request, response: Response) => {
	// all incoming requests must be websockets
	if (request.headers.upgrade?.toLowerCase() !== 'websocket') {
		response.end()
		return
	}

	// can be Connection: keep-alive, Upgrade
	if (request.headers.connection?.match(/\bupgrade\b/i)) {
		response.end()
		return
	}

	console.debug('ws:connection_upgraded')

	// webSocketServerClient.handleUpgrade(request, request.socket, Buffer.alloc(0), (webSocket) => {
	// 	webSocket.on('message', function (message) {
	// 		webSocket.send(`Hello from server, ${message}!`)

	// 		setTimeout(() => {
	// 			webSocket.close(1000, "closed due timeout")
	// 		}, 5000)
	// 	})
	// })
}