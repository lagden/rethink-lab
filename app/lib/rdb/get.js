/* eslint camelcase: 0 */

/**
 * Módulo de ajuda para o RethinkDB
 * @module app/lib/rdb/get
 */
'use strict'

const r = require('rethinkdb')
const debug = require('@tadashi/debug')

/**
 * Verifica se o banco existe ou cria
 *
 * @param {object} conn - Conexão do banco de dados
 * @param {string} name - Nome do banco de dados
 * @returns {boolean} Retorna true se encontrou ou criou um banco, ou false
 * @throws {Error} Falha no banco de dados
 */
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

/**
 * Verifica se a tabela existe ou cria
 *
 * @param {object} conn - Conexão do banco de dados
 * @param {object} db   - Banco de dados
 * @param {string} name - Nome da tabela
 * @returns {boolean} Retorna true se encontrou ou criou uma tabela, ou false
 * @throws {Error} Falha na tabela
 */
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
		debug.error(err)
	}
	throw new Error(`Falha na tabela: ${name}`)
}

exports.db = db
exports.table = table
