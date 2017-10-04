'use strict'

const r = require('rethinkdb')
const debug = require('../debug')
const {sendTo} = require('../util')
const connect = require('./conn')
const {db, table} = require('./get')

function _falha(data) {
	const to = data.from
	data.from = data.to
	data.to = to
	data.type = 'server'
	data.text = 'Sua messagem não foi enviada...'
	sendTo(to, JSON.stringify(data))
}

async function message(data) {
	let conn
	try {
		conn = await connect()
		const {broker, room} = data
		const dbName = `broker_${broker}`
		const tableName = `room_${room}`
		await db(conn, dbName)
		await table(conn, r.db(dbName), tableName)
		const {inserted = false} = await r.db(dbName).table(tableName).insert(data).run(conn)
		if (inserted) {
			sendTo(data.to, JSON.stringify(data))
		} else {
			_falha(data)
		}
		debug.log('inserted', inserted)
	} catch (err) {
		debug.error(err)
		_falha(data)
	}
	if (conn && conn.close) {
		conn.close()
	}
	return false
}

exports.message = message
