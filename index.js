'use strict'

const debug = require('./app/lib/debug')
const server = require('./app/.')

const {PORT = 3000} = process.env

function onListen() {
	debug.log(`Server listening on port ${server.address().port}`)
}

// Start Server
server.listen(PORT, onListen)

// wscat -c ws://127.0.0.1:8081 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE0OTY3MjAzNDY4NDMsImlhdCI6MTQ5NjcyMDM0Njg0MywiZXhwIjoxNDk2ODA2NzQ2ODQzLCJqdGkiOiJpZDEyMzQ1NiJ9.l1R33deXZYxCKicTzlyy2QPDEuM1FhZ0BzesIswGgmM"
// wscat -c ws://user:passwd@127.0.0.1:8081
