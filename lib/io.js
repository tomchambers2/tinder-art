var processor = require('./processor')
var tinder = require('./tinder')
var debug = require('debug')

function sendError(err) {
	console.log(err)
	socket.emit(socket, err)
}

module.exports = function(http) {
	var io = require('socket.io')(http)
	io.on('connection', function(socket){
	  debug('A user connected')

	  var partnerId

	  socket.on('set partner', function(data) {
	  	partnerId = data
	  })	  

	  socket.on('send message', function(message){
	  	console.log('got message',message,partnerId);
	  	var processedMessage = processor.processMessage(message)
	    socket.emit('chat message', { type: 'user', message: processedMessage })
	    tinder.sendMessage(partnerId, processedMessage, function(err) {
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