import { WebSocket } from 'ws'
import { uuid } from '../utils/uuid'
import { WebSocketServerHandlers, createWebSocketServer } from './server'


class WebSocketsList {

	private constructor() { }

	activeClients = new Map<string, WebSocket>()

	addClient(socket: WebSocket) {
		const clientId = uuid()
		this.activeClients.set(clientId, socket)
		return clientId
	}

	removeClient(key: string) {
		this.activeClients.delete(key)
	}

	static empty() {
		return new WebSocketsList()
	}
}

const path = '/chat'
const connectionClients = WebSocketsList.empty()
const messageHistory = []

const handlers: WebSocketServerHandlers = {
	onConnection: (socket) => {
		const clientId = connectionClients.addClient(socket)

		socket.send(`Welcome. ${clientId}`)

		socket.on('close', (eventCode: number) => {
			console.info('websocket:close', eventCode)
			connectionClients.removeClient(clientId)
		})

		console.debug('websocket:connection', clientId)
	},
	onError: (error) => {
		console.error('websocket:error', error)
	},
	onMessage: (data) => {
		console.debug('websocket:message %s', data)
		messageHistory.push(data)
	}
}

class ChatServer {
	static start() {
		createWebSocketServer({ path, }, handlers)
	}
}

export { ChatServer }
export default ChatServer