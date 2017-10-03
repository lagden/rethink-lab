'use strict'

const {broadcast, sendTo} = require('./chat')

class ClientSocket {
	constructor(ws) {
		// console.log(ws.upgradeReq.headers)
		const id = ws.upgradeReq.headers['sec-websocket-key']
		this.ws = ws
		this.ws._key = id
		// this.ws._user = {from_auth}
		// this.ws._broker = {from_auth}

		// Listeners
		this.ws.on('message', this.onMessage)
		this.ws.on('close', this.onClose)
	}

	onMessage(_data) {
		console.log(this._key)
		const id = this._key
		try {
			const data = JSON.parse(_data)
			const _to = sendTo(data.to)
			switch (data.type) {
				case 'message':
					if (_to) {
						data.from = id
						_to.send(JSON.stringify(data))
					}
					break
				default:
					console.log(`type not found: ${data.type}`)
			}
		} catch (err) {
			console.dir(err, {colors: true})
		}
	}

	onClose() {
		console.log(this._key)
		const id = this._key
		broadcast(JSON.stringify({
			type: 'removeUser',
			user: id
		}))
	}
}

module.exports = ClientSocket
