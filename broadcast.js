'use strict'

function broadcast(data, wss, ws) {
	wss.clients.forEach(client => {
		if (client !== ws && client.readyState === 1) {
			client.send(data)
		}
	})
}

module.exports = broadcast
