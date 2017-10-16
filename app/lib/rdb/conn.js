/**
 * Módulo de conexão com o banco
 * @module app/lib/rdb/conn
 */

'use strict'

const r = require('rethinkdb')

const {RDB_HOST: host = '127.0.0.1', RDB_PORT: port = 28015} = process.env

/**
 * Conecta com o banco
 *
 * @returns {Promise} Promise object da conexão
 */
function conn() {
	return r.connect({host, port})
}

module.exports = conn
