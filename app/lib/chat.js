'use strict'

// const debug = require('./debug')
const wss = require('../websocket')

function broadcast(data, ws = false) {
	wss.clients.forEach(client => {
		if (client !== ws && client.readyState === 1) {
			client.send(data)
		}
	})
}

function sendTo(id) {
	let _to = false
	wss.clients.forEach(client => {
		if (client.readyState === 1 && client._key === id) {
			_to = client
		}
	})
	return _to
}

function online(ws) {
	const users = []
	wss.clients.forEach(client => {
		if (client !== ws && client.readyState === 1) {
			users.push(client._key)
		}
	})
	ws.send(JSON.stringify({
		type: 'listUsers',
		users
	}))
}

exports.broadcast = broadcast
exports.sendTo = sendTo
exports.online = online
