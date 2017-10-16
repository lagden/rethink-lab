'use strict'

const server = require('./web-server')
const wss = require('./web-socket-server')
const {broadcast, online} = require('./lib/util')
const ClientSocket = require('./lib/client')

function onConnection(ws) {
	const clientSocket = new ClientSocket(ws)

	// Envia para você todos os usuários que estão conectados
	online(clientSocket.ws)

	// Avisa para os outros usuários que você também está conectado
	broadcast(JSON.stringify({
		type: 'addUser',
		user: clientSocket.ws._user
	}), ws)
}

wss.on('connection', onConnection)

module.exports = server
