'use strict'

var processor = require('./processor')
var tinder = require('./tinder')
var debug = require('debug')
var _ = require('lodash')

function sendError(err) {
	console.log(err)
	socket.emit(socket, err)
}

function getUpdates(matchId, partnerId, lastUpdate, callback) {
  	tinder.getUpdatesForMatch(matchId, partnerId, lastUpdate, function(err, messages) {
  		if (err) callback(err)
  		callback(null, messages)
  	})
}

module.exports = function(http) {
	var io = require('socket.io')(http)
	io.on('connection', function(socket){
	  debug('A user connected')

	  var partnerId
	  var matchId
	  var lastUpdate = Date.now()

	  function sendMessage(remote, message) {
	  	socket.emit('chat message', { type: remote ? 'remote' : 'user' })
	  }

	  socket.on('set partner', function(data) {
	  	partnerId = data.partnerId
	  	matchId = data.matchId
	  	console.log('partner set');
	  	var updateCallback = function(err, messages) {
	  		var lastUpdate = Date.now()
	  		_.forEach(messages, function(message) {
	  			socket.emit('chat message', { type: 'remote', message: message })
	  		})
			setTimeout(function() { getUpdates(matchId, partnerId, lastUpdate, updateCallback) }, 5000)	  	
	  	}
	  	getUpdates(matchId, partnerId, lastUpdate, updateCallback)
	  })	  

	  socket.on('send message', function(message){
	  	console.log('will send message', message, matchId);
	  	var processedMessage = processor.processMessage(message)
	    socket.emit('chat message', { type: 'user', message: processedMessage })
	    tinder.sendMessage(matchId, processedMessage, function(err) {
	    	if (err) {
	    		sendError(socket, err)
	    	}
	    })
	  });

	  socket.on('disconnect', function(){
	    debug('A user disconnected')
	  })
	})
}