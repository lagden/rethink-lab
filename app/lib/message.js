/**
 * Módulo de Mensagem
 * @module app/lib/message
 */
'use strict'

const r = require('rethinkdb')
const debug = require('@tadashi/debug')
const {sendTo} = require('./util')

function _falha(data) {
	const to = data.from
	data.from = data.to
	data.to = to
	data.type = 'server'
	data.text = 'Sua messagem não foi enviada...'
	sendTo(to, JSON.stringify(data))
}

/**
 * Insere as mensagens no banco de dados
 *
 * @param {object} data - Objeto JSON da mensagem
 * @param {object} conn - Conexão do banco de dados
 * @returns {boolean} Retorna true se inseriu no banco, ou false
 */
async function message(data, conn) {
	let ok = false
	try {
		const {broker} = data
		const dbName = `broker_${broker}`
		const tableName = `messages`
		const {inserted = false} = await r.db(dbName).table(tableName).insert(data).run(conn)
		ok = inserted
		if (ok === false) {
			_falha(data)
		}
		debug.log('inserted', ok)
	} catch (err) {
		debug.error(err)
		_falha(data)
	}
	return ok
}

exports.message = message
