'use strict'

const server = require('./webserver')
const wss = require('./websocket')
const {broadcast, online} = require('./lib/chat')
const ClientSocket = require('./lib/client')

function onConnection(ws) {
	const clientSocket = new ClientSocket(ws)

	// Pega todos os usuários conectados
	online(clientSocket.ws)

	// Avisa para os outros usuários que você também está conectado
	broadcast(JSON.stringify({
		type: 'addUser',
		user: clientSocket.ws._user
	}), ws)
}

wss.on('connection', onConnection)

module.exports = server
