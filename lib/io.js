var processor = require('./processor')

module.exports = function(http) {
	var io = require('socket.io')(http)
	io.on('connection', function(socket){
	  console.log('a user connected');

	  socket.emit('chat message', { type: 'remote', message: 'hi there' })
	  setTimeout(function() {
	  	socket.emit('chat message', { type: 'remote', message: 'im a guy on tinder, saying random things' })
	  }, 2000) 	  	  	  

	  socket.on('process message', function(message){
	    socket.emit('chat message', { type: 'user', message: takeMessage(message) })
	  });

	  socket.on('disconnect', function(){
	    console.log('user disconnected')
	  })
	})
}

function takeMessage(message) {
	console.log('message: ' + message);	
	var message = processor.processMessage(message)
	return message;
}