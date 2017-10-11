/* eslint camelcase: 0 */

'use strict'

const r = require('rethinkdb')
const debug = require('../debug')

// Retorna um db ou cria se não existir
async function db(conn, name) {
	try {
		const dbList = await r.dbList().run(conn)
		const db = dbList.find(db => db === name)
		if (db) {
			return true
		}
		const {dbs_created} = await r.dbCreate(name).run(conn)
		return dbs_created === 1
	} catch (err) {
		debug.error(err)
	}
	throw new Error(`Falha no banco de dados: ${name}`)
}

// Retorna uma tabela ou cria se não existir
async function table(conn, db, name, index) {
	try {
		const tableList = await db.tableList().run(conn)
		const table = tableList.find(table => table === name)
		if (table) {
			return true
		}
		const {tables_created} = await db.tableCreate(name).run(conn)
		if (tables_created === 1) {
			await db.table(name).indexCreate(index).run(conn)
		}
		return tables_created === 1
	} catch (err) {
		debug.error(err)
	}
	throw new Error(`Falha na tabela: ${name}`)
}

exports.db = db
exports.table = table
