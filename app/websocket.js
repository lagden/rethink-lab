'use strict'

// const {parse} = require('querystring')
const {Server} = require('uws')
const server = require('./webserver')
const debug = require('./lib/debug')

debug.log('entrou no wss')

// WebSocket
const wss = new Server({server, async verifyClient(info, cb) {
	// let valid = false
	// let code = 401
	// let name = 'Unauthorized'
	// try {
	// 	const {jwt} = parse(info.req.url.split('?')[1])
	// 	valid = await verifyJWT(jwt)
	// } catch (err) {
	// 	code = 500
	// 	name = 'Internal Server Error'
	// 	debug.error(err)
	// }
	// cb(valid, code, name)
	info.req._tex = 'apenas um show'
	cb(true, 401, 'Unauthorized')
}})

module.exports = wss
