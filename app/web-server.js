/**
 * Módulo de Web Server
 * @module app/webserver
 */
'use strict'

const {join, normalize} = require('path')
const {createReadStream} = require('fs')
const {PassThrough} = require('stream')
const http = require('http')
const {lookup} = require('mime-types')
const debug = require('@tadashi/debug')

/** Cria o servidor web */
const server = http.createServer((req, res) => {
	const pass = new PassThrough()
	const file = req.url === '/' ? 'index.html' : req.url
	const mime = lookup(file)
	if (mime) {
		res.setHeader('Content-Type', mime)
	}
	const read = createReadStream(normalize(join(__dirname, '..', 'public', file)), 'utf8')
	read.on('error', debug.error).pipe(pass).pipe(res)
})

module.exports = server
