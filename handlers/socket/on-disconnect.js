'use strict'

var emitter = require('../../lib/eventemitter')

module.exports = function() {
	emitter.removeListener('activate user', this.activateUserCallback)
	console.log("A USER HAS DISCONNECTED")
}