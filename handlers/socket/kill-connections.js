'use strict'

var emitter = require('../../lib/eventemitter')

module.exports = function() {
	this.disconnect('Socket was killed by admin');
	emitter.removeListener('kill connections', this.killConnectionsCallback)
	console.log("THIS SOCKET DISCONNECTED")
}