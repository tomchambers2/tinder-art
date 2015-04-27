'use strict'

var socketAuth = require('./handlers/socket/socket-auth')
var getUpdates = require('./handlers/socket/get-updates')
var setPartner = require('./handlers/socket/set-partner')
var refreshPartner = require('./handlers/socket/refresh-partner')
var sendMessage = require('./handlers/socket/send-message')
var onDisconnect = require('./handlers/socket/on-disconnect')

module.exports = function(io) {
	io.use(socketAuth.attachCredentials)

	io.on('connection', function(socket){
		console.log("USER CONNECTED")

		socket.emit('request partner')

		getUpdates.bind(socket)()

	  	socket.on('set partner', setPartner)

	  	socket.on('refresh partner', refreshPartner)

		socket.on('send message', sendMessage)

	  	socket.on('disconnect', onDisconnect)
	})
}