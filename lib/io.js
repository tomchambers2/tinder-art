var processor = require('./processor')
var tinder = require('./tinder')
var debug = require('debug')

function sendError(err) {
	console.log(err)
	socket.emit(socket, err)
}

function getUpdates(matchId, callback) {
  	console.log('getting updates')
  	tinder.getUpdatesForMatch(matchId, function(err, result) {
  		console.log("GOT UPDATES FOR YA")
  	})
}

module.exports = function(http) {
	var io = require('socket.io')(http)
	io.on('connection', function(socket){
	  debug('A user connected')

	  var partnerId
	  var matchId

	  socket.on('set partner', function(data) {
	  	partnerId = data.partnerId
	  	matchId = data.matchId
	  	console.log('partner set');
	  	getUpdates(matchId)
		//setTimeout(getUpdates, 1)	  	
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