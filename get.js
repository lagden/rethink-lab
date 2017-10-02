'use strict'

const r = require('rethinkdb')

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
		console.dir(err, {colors: true})
	}

	throw new Error(`Falha no banco de dados: ${name}`)
}

async function table(conn, db, name) {
	try {
		const tableList = await db.tableList().run(conn)
		const table = tableList.find(table => table === name)
		if (table) {
			return true
		}
		const {tables_created} = await db.tableCreate(name).run(conn)
		return tables_created === 1
	} catch (err) {
		console.dir(err, {colors: true})
	}
	throw new Error(`Falha na tabela: ${name}`)
}

exports.db = db
exports.table = table
