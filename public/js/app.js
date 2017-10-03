/* globals window, Object, document, WebSocket */
/* eslint import/extensions: 0 */

'use strict'

import Chatbox from './chatbox.js'

const protocolo = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
const ws = new WebSocket(`${protocolo}//${window.location.host}`)
const chatBox = Object.create(null)

function getChatBox(userID) {
	let box = chatBox[`chatbox_${userID}`]
	if (box) {
		return box
	}
	box = new Chatbox(ws, userID)
	chatBox[`chatbox_${userID}`] = box
	return box
}

function onMessage(event) {
	console.log('[message]')
	const data = JSON.parse(event.data)
	// const time = new Date(data.date)
	// const timeStr = time.toLocaleTimeString()
	let box
	if (data.from) {
		box = getChatBox(data.from)
	}

	switch (data.type) {
		case 'message':
			box.add(data.text, 'other')
			break
		case 'addUser':
			addUser(data.text)
			break
		case 'removeUser':
			removeUser(data.text)
			break
		case 'listUsers':
			console.log(data.users)
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
}

ws.onopen = onOpen
ws.onclose = onClose
ws.onmessage = onMessage

// UserList Stuff
const userList = document.getElementById('userList')

function addUser(userID) {
	userList.insertAdjacentHTML('beforeend', `<li class="user" id="${userID}" data-user="${userID}">${userID}</li>`)
}

function removeUser(userID) {
	const user = document.getElementById(userID)
	const box = getChatBox(userID)
	box.destroy()
	if (user) {
		user.remove()
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
	const userID = target.dataset.user
	if (userID) {
		getChatBox(userID)
	}
}

userList.addEventListener('click', loadChatbox, false)
