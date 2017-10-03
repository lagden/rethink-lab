'use strict'

const {join} = require('path')
const {createReadStream} = require('fs')
const {PassThrough} = require('stream')
const http = require('http')
const {Server} = require('uws')
const {lookup} = require('mime-types')
// const r = require('rethinkdb')
const broadcast = require('./broadcast')

// WebServer
const server = http.createServer((req, res) => {
	const pass = new PassThrough()
	const file = req.url === '/' ? 'index.html' : req.url
	const mime = lookup(file)
	if (mime) {
		res.setHeader('Content-Type', mime)
	}
	const read = createReadStream(join(__dirname, 'public', file), 'utf8')
	read.on('error', console.error).pipe(pass).pipe(res)
})

// WebSocket
const wss = new Server({server})

function findClient(id) {
	let _to = false
	wss.clients.forEach(client => {
		if (client.readyState === 1 && client._key === id) {
			console.log('achou o cli...', client._key)
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
	console.log()
	ws.send(JSON.stringify({
		type: 'listUsers',
		users
	}))
}

function onMessage(id) {
	return _data => {
		try {
			const data = JSON.parse(_data)
			const _to = findClient(data.to)
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
}

function onClose(id) {
	return () => {
		broadcast(JSON.stringify({
			type: 'removeUser',
			text: id
		}), wss)
	}
}

function onConnection(ws) {
	// console.log(ws.upgradeReq.headers)
	const id = ws.upgradeReq.headers['sec-websocket-key']
	ws._key = id
	// ws._user = {from_auth}
	// ws._broker = {from_auth}

	// Carrega a lista de usuários
	online(ws)

	// Avisa que você tb está online
	broadcast(JSON.stringify({
		type: 'addUser',
		text: id
	}), wss, ws)

	// Listeners
	ws.on('message', onMessage(id))
	ws.on('close', onClose(id))
}

wss.on('connection', onConnection)

function onListen() {
	console.log('websocket on 8081')
}

// Start Server
server.listen(8081, onListen)

// wscat -c ws://127.0.0.1:8081 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0OTY3MjAzNDY4NDMsImlhdCI6MTQ5NjcyMDM0Njg0MywiZXhwIjoxNDk2ODA2NzQ2ODQzLCJqdGkiOiJpZDEyMzQ1NiJ9.l1R33deXZYxCKicTzlyy2QPDEuM1FhZ0BzesIswGgmM"
// wscat -c ws://user:passwd@127.0.0.1:8081
