'use strict'

const r = require('rethinkdb')
const {db, table} = require('./get')

async function message(data) {
	try {
		const {broker, room} = data
		const dbName = `broker_${broker}`
		const tableName = `room_${room}`
		const conn = await r.connect({host: 'localhost', port: 28015})
		await db(conn, dbName)
		await table(conn, r.db(dbName), tableName)

	} catch (err) {
		console.dir(err, {colors: true})
	}
	return false
}

async function record(conn, db, name) {
}

exports.db = db
exports.table = table
