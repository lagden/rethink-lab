'use strict'

const r = require('rethinkdb')
const debug = require('../debug')
const {sendTo} = require('../chat')
const connect = require('./conn')
const {db, table} = require('./get')

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
			const _to = sendTo(data.to)
			if (_to) {
				_to.send(JSON.stringify(data))
			}
		}
		debug.log('inserted', inserted)
	} catch (err) {
		debug.error(err)
	}
	if (conn && conn.close) {
		conn.close()
	}
	return false
}

exports.message = message
