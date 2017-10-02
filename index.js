'use strict'

const {join} = require('path')
const {createReadStream} = require('fs')
const http = require('http')
// const r = require('rethinkdb')
const {Server} = require('uws')
const heartbeat = require('./heartbeat')

const sockets = [];

// WebServer
const server = http.createServer((req, res) => {
	const readStream = createReadStream(join(__dirname, 'public', 'index.html'), 'utf8')
	res.writeHead(200, {'Content-Type': 'text/html'})
	readStream.pipe(res)
})

// WebSocket
const wss = new Server({server})

function onMessage(message) {
	console.log(message)
	try {
		const data = JSON.parse(message)
		switch(data.type) {
			case 'message':
				console.dir(`message: ${message}`, {colors: true})
				break
			case 'feed':
				console.dir(`feed: ${message}`, {colors: true})
				break
			default:
				console.log(`type not found: ${data.type}`)
		}
	} catch (err) {
		console.dir(err, {colors: true})
	}
}

wss.on('connection', ws => {
	console.dir(ws._socket, {colors: true})
	const id = ws.upgradeReq.headers['sec-websocket-key']

	console.log('++++++++++++++++', id)

	heartbeat(wss, ws)
	ws.on('message', onMessage)
	ws.send(JSON.stringify({
		type: 'corretora'
	}))

	sockets[id] = ws;
})

function onListen() {
	console.log('websocket on 8081')
}

// Start Server
server.listen(8081, onListen)

// wscat -c ws://127.0.0.1:8081 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0OTY3MjAzNDY4NDMsImlhdCI6MTQ5NjcyMDM0Njg0MywiZXhwIjoxNDk2ODA2NzQ2ODQzLCJqdGkiOiJpZDEyMzQ1NiJ9.l1R33deXZYxCKicTzlyy2QPDEuM1FhZ0BzesIswGgmM"
// wscat -c ws://user:passwd@127.0.0.1:8081