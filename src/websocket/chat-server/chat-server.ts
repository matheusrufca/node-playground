import { WebSocket } from 'ws'
import { deserializeBson, serializeBson } from '../../utils/bson'
import { uuid } from '../../utils/uuid'
import { WebSocketServerHandlers, createWebSocketServer } from '../server'


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
		socket.binaryType = 'arraybuffer'
		const clientId = connectionClients.addClient(socket)

		// socket.send(`Welcome. ${clientId}`)

		socket.send(serializeBson({ clientId }))

		socket.on('close', (eventCode: number) => {
			console.info('websocket:close', eventCode)
			connectionClients.removeClient(clientId)
		})

		console.debug('websocket:connection', clientId)
	},
	onError: (error) => {
		console.error('websocket:error', error)
	},
	onMessage: (rawData, isBinary) => {
		console.debug('websocket:message', rawData, rawData.toString(), isBinary)
		try {
			const data = deserializeBson(rawData)
			console.debug('bson:deserialize', data)
			messageHistory.push(data)
		} catch (error) {
			console.error('Unable to parse message', error)
		}
	}
}

class ChatServer {
	static start() {
		createWebSocketServer({ path, }, handlers)
	}
}


const handleIncomingChatMessages = () => { }



export { ChatServer }
export default ChatServer