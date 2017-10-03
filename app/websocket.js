'use strict'

const {Server} = require('uws')
const server = require('./webserver')
const debug = require('./lib/debug')

debug.log('entrou no wss')

// WebSocket
const wss = new Server({server})

module.exports = wss
