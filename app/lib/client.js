'use strict'

const {parse} = require('querystring')
const debug = require('./debug')
const {broadcast} = require('./util')
const {message} = require('./rdb/message')

function asc(a, b) {
	if (a < b) {
		return -1
	}
	if (a > b) {
		return 1
	}
	return 0
}

function room(accumulator, currentValue) {
	return `${accumulator}_${currentValue}`
}

class ClientSocket {
	constructor(ws) {
		// console.log(ws.upgradeReq.headers)
		const {user, broker} = parse(ws.upgradeReq.url.split('?')[1])
		this.ws = ws
		this.ws._key = ws.upgradeReq.headers['sec-websocket-key']
		this.ws._user = user
		this.ws._broker = broker

		debug.log(`entrando ${this.ws._user}`)

		// Listeners
		this.ws.on('message', this.onMessage)
		this.ws.on('close', this.onClose)
	}

	onMessage(_data) {
		debug.log(`onMessage`, _data)
		try {
			const data = JSON.parse(_data)
			switch (data.type) {
				case 'cursor':
					debug.log('abrindo o cursor')
					break
				case 'message':
					data.from = this._user
					data.room = [this._user, data.to].sort(asc).reduce(room)
					data.broker = this._broker
					message(data)
					break
				default:
					debug.log(`type not found: ${data.type}`)
			}
		} catch (err) {
			debug.error(err)
		}
	}

	onClose() {
		debug.log(`saindo ${this._user}`)
		broadcast(JSON.stringify({
			type: 'removeUser',
			user: this._user
		}))
	}
}

module.exports = ClientSocket
