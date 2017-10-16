/**
 * Módulo de inscrição
 * @module app/lib/changes
 */
'use strict'

const r = require('rethinkdb')
const debug = require('@tadashi/debug')
const connect = require('./rdb/conn')
const {db, table} = require('./rdb/get')

/**
 * Abre a conexão com o banco e se inscreve no changefeeds
 *
 * @param {object} client - socket client
 * @returns {(boolean|object)} Retorna a conexão se não ocorrer erros, ou false
 */
async function changes(client) {
	let conn = false
	try {
		conn = await connect()
		const {_broker: broker, _user: user} = client
		const dbName = `broker_${broker}`
		const tableName = `messages`
		await db(conn, dbName)
		await table(conn, r.db(dbName), tableName)
		const feed = await r.db(dbName).table(tableName).filter({to: user}).changes().run(conn)
		feed.on('data', data => {
			debug.log('feed data', data.new_val, user)
			if (client.readyState === 1) {
				debug.log('enviadooo para...', user)
				client.send(JSON.stringify(data.new_val))
			}
		})
		feed.on('error', err => {
			debug.error('feed', err.message)
		})
	} catch (err) {
		debug.error(err.message)
	}
	return conn
}

module.exports = changes
