/* globals document */
'use strict'

class Chatbox {
	constructor(ws, user) {
		const docFragment = document.createDocumentFragment()
		this.user = user
		this.ws = ws
		this.box = document.createElement('div')
		this.box.id = `chatbox_${user}`
		this.box.className = 'box'
		this.content = document.createElement('div')
		this.content.className = 'content'
		this.input = document.createElement('input')
		this.input.type = 'text'
		this.input.className = 'input'
		this.box.appendChild(this.content)
		this.box.appendChild(this.input)
		docFragment.appendChild(this.box)
		const boxes = document.getElementById('boxes')
		boxes.appendChild(docFragment)
		this.input.addEventListener('keyup', this)
	}

	add(v, whois) {
		const p = document.createElement('p')
		const txt = document.createTextNode(`${whois}: ${v}`)
		p.appendChild(txt)
		this.content.insertAdjacentElement('beforeend', p)
		p.scrollIntoView(true)
	}

	sendMessage(event) {
		if (event.keyCode === 13) {
			const v = this.input.value
			this.input.value = ''
			const data = {
				type: 'message',
				text: v,
				to: this.user,
				date: Date.now()
			}
			console.log('enviado para:', data)
			this.ws.send(JSON.stringify(data))
			this.add(v, 'me')
		}
	}

	destroy() {
		this.input.removeEventListener('keyup', this)
		this.box.remove()
	}

	handleEvent(event) {
		console.log(event.type)
		if (event.type === 'keyup') {
			this.sendMessage(event)
		}
	}
}

export default Chatbox
