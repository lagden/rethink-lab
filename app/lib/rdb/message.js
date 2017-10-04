'use strict'

const r = require('rethinkdb')
const debug = require('../debug')
const {sendTo} = require('../chat')
const connect = require('./conn')
const {db, table} = require('./get')

async function message(data) {
	try {
		const conn = await connect()
		const {broker, room} = data
		const dbName = `broker_${broker}`
		const tableName = `room_${room}`
		await db(conn, dbName)
		await table(conn, r.db(dbName), tableName)
		const cursor = await r.db(dbName).table(tableName).changes().run(conn)
		cursor.each((err, row) => {
			if (err) {
				throw err
			}

			if (row < 0) {
				cursor.close()
				return false
			}

			const _to = sendTo(row.new_val.to)
			if (_to) {
				_to.send(JSON.stringify(row.new_val))
			}
		})
	} catch (err) {
		debug.error(err)
	}
	return false
}

exports.message = message
