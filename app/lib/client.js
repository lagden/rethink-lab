/**
 * Módulo do ClientSocket
 * @module app/lib/client
 */
'use strict'

const {parse} = require('querystring')
const debug = require('@tadashi/debug')
const {broadcast, asc, room} = require('./util')
const {message} = require('./message')
const changes = require('./changes')

/** Class representa um cliente WebSocket. */
class ClientSocket {
	/**
	 * Cria o clientSocket
	 * @param {object} ws - socket client
	 */
	constructor(ws) {
		// console.log(ws.upgradeReq.headers)
		const {user, broker} = parse(ws.upgradeReq.url.split('?')[1])
		this.ws = ws
		this.ws._user = user
		this.ws._broker = broker

		console.log(ws.upgradeReq._tex)

		debug.log(`entrando ${this.ws._user}`)

		// Changefeeds
		// Escuta as mensagem que são enviadas para você
		changes(ws).then(conn => {
			this.ws._conn = conn
			this.ws.on('message', this._onMessage)
		})

		this.ws.on('close', this._onClose)
	}

	/** Manipulador de mensagem */
	_onMessage(_data) {
		debug.log(`onMessage`, _data)
		try {
			const data = JSON.parse(_data)
			switch (data.type) {
				case 'message':
					data.from = this._user
					data.broker = this._broker
					data.room = [this._user, data.to].sort(asc).reduce(room)
					message(data, this._conn)
					break
				default:
					debug.log(`type not found: ${data.type}`)
			}
		} catch (err) {
			debug.error(err)
		}
	}

	/** Manipulador do socket fechado */
	_onClose() {
		debug.log(`saindo ${this._user}`)
		// Fecha a conexão com o banco
		if (this._conn && this._conn.close) {
			this._conn.close()
		}
		// Avisa para todos que você saiu
		broadcast(JSON.stringify({
			type: 'removeUser',
			user: this._user
		}))
	}
}

module.exports = ClientSocket
