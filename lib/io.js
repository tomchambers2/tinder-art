'use strict'

module.exports = function(http) {
	return require('socket.io')(http)
}