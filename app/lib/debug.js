'use strict'

const debug = require('debug')

const PREFIX = 'chat-websocket'

const log = debug(`${PREFIX}:log`)
const error = debug(`${PREFIX}:error`)

log.log = console.log.bind(console)

exports.log = log
exports.error = error
