'use strict'

function _heartbeat() {
	this.isAlive = true
}

function heartbeat(wss, ws) {
	ws.isAlive = true
	ws.on('pong', _heartbeat)

	setInterval(() => {
		// wss.broadcast('message', 'serverrrrr')
		wss.clients.forEach(ws => {
			if (ws.isAlive === false) {
				return ws.terminate()
			}
			ws.isAlive = false
			ws.ping('', false, true)
		})
	}, 1000)
}

module.exports = heartbeat
