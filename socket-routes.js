'use strict'

var emitter = require('./lib/eventemitter')

var socketAuth = require('./handlers/socket/socket-auth')
var getUpdates = require('./handlers/socket/get-updates')
var setPartner = require('./handlers/socket/set-partner')
var refreshPartner = require('./handlers/socket/refresh-partner')
var sendMessage = require('./handlers/socket/send-message')
var onDisconnect = require('./handlers/socket/on-disconnect')
var categorise = require('./handlers/socket/categorise')
var assignPartner = require('./handlers/socket/assign-partner')
var getDefaultPhrases = require('./handlers/socket/get-default-phrases')

module.exports = function(io) {
	io.use(socketAuth.attachCredentials)

	io.on('connection', function(socket){
		console.log("USER CONNECTED")

		socket.emit('request partner')

		socket.on('categorise', categorise)

		socket.on('get default phrases', getDefaultPhrases)

		socket.on('get updates', getUpdates)

	  	socket.on('set partner', setPartner)

	  	socket.activateUserCallback = assignPartner.bind(socket)
		emitter.on('activate user', socket.activateUserCallback)
		
	  	socket.on('refresh partner', refreshPartner)

		socket.on('send message', sendMessage)

	  	socket.on('disconnect', onDisconnect)
	})
}