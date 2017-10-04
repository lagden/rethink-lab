/* globals window, Object, document, WebSocket, prompt */
/* eslint import/extensions: 0 */
/* eslint no-alert: 0 */

'use strict'

import Chatbox from './chatbox.js'

const userList = document.getElementById('userList')
const chatBox = Object.create(null)
const protocolo = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
// const ws = new WebSocket(`${protocolo}//${window.location.host}`)
let ws

function getChatBox(user) {
	let box = chatBox[`chatbox_${user}`]
	if (box) {
		return box
	}
	box = new Chatbox(ws, user)
	chatBox[`chatbox_${user}`] = box
	return box
}

function onMessage(event) {
	const data = JSON.parse(event.data)
	console.log('[message]', data)
	// const time = new Date(data.date)
	// const timeStr = time.toLocaleTimeString()
	let box
	if (data.from) {
		box = getChatBox(data.from)
	}

	switch (data.type) {
		case 'server':
			box.add(data.text, '[server]')
			break
		case 'message':
			box.add(data.text, data.from)
			break
		case 'addUser':
			addUser(data.user)
			break
		case 'removeUser':
			removeUser(data.user)
			break
		case 'listUsers':
			data.users.forEach(user => {
				addUser(user)
			})
			break
		default:
			console.log(`type not found: ${data.type}`)
	}
}

function onOpen(event) {
	console.log('[opened]', event)
}

function onClose(event) {
	console.log('[disconnected]', event)
	userList.querySelectorAll('li.user').forEach(el => {
		removeUser(el.dataset.user)
	})
}

// TMP
function initialize() {
	const username = prompt('Escreva seu username:')
	if (username) {
		ws = new WebSocket(`${protocolo}//${window.location.host}?user=${username}&broker=8`)
		ws.onopen = onOpen
		ws.onclose = onClose
		ws.onmessage = onMessage
	}
}

// UserList Stuff
function addUser(user) {
	userList.insertAdjacentHTML('beforeend', `<li class="user" id="user_${user}" data-user="${user}">${user}</li>`)
}

function removeUser(user) {
	const _user = document.getElementById(`user_${user}`)
	const _box = getChatBox(user)
	_box.destroy()
	if (_user) {
		_user.remove()
	}
}

function bubblingMatchesSelector(target, selector) {
	if (!target) {
		return false
	}

	if (target.matches(selector)) {
		return target
	}

	return bubblingMatchesSelector(target.parentElement, selector)
}

function loadChatbox(event) {
	const target = bubblingMatchesSelector(event.target, '.user')
	const user = target.dataset.user
	if (user) {
		getChatBox(user)
	}
}

userList.addEventListener('click', loadChatbox, false)

initialize()
