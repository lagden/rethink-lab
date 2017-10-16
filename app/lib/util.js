'use strict'

// const debug = require('@tadashi/debug')
const wss = require('../web-socket-server')

function _check(ws, client) {
	return (
		client !== ws &&
		client.readyState === 1 &&
		client._broker &&
		client._broker === ws._broker
	)
}

function broadcast(data, ws = false) {
	wss.clients.forEach(client => {
		if (client !== ws && client.readyState === 1) {
			client.send(data)
		}
	})
}

function sendTo(user, data) {
	wss.clients.forEach(client => {
		if (client.readyState === 1 && client._user === user) {
			client.send(data)
		}
	})
}

// Somente os usuários que pertecem ao mesmo Broker
function online(ws) {
	const users = []
	wss.clients.forEach(client => {
		if (_check(ws, client)) {
			users.push(client._user)
		}
	})
	ws.send(JSON.stringify({
		type: 'listUsers',
		users
	}))
}

// Sort
function asc(a, b) {
	if (a < b) {
		return -1
	}
	if (a > b) {
		return 1
	}
	return 0
}

// Reduce
function room(accumulator, currentValue) {
	return `${accumulator}_${currentValue}`
}

exports.broadcast = broadcast
exports.sendTo = sendTo
exports.online = online
exports.asc = asc
exports.room = room
