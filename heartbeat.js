'use strict'

function _pulse() {
	this.isAlive = true
}

function heartbeat(wss, ws) {
	ws.isAlive = true
	ws.on('pong', _pulse)

	setInterval(() => {
		wss.clients.forEach(_ws => {
			if (_ws.isAlive === false) {
				return _ws.terminate()
			}
			_ws.isAlive = false
			_ws.ping('')
		})
	}, 30000)
}

module.exports = heartbeat
