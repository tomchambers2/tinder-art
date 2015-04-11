$(document).ready(function() {
  var socket = io();

  socket.on('chat message',  function(chat) {
  	addMessage(chat)
  })

  $('.submit').click(function() {
  	sendMessage($('.user-input').val())
  	flushInput($('.user-input'))
  })

  function addMessage(chat) {
    var side = chat.type === 'user' ? 'right' : 'left'
	 $('.chat-screen').append('<div class="message triangle-isosceles '+side+'">'+chat.message+"</div>")  	
  }

  function sendMessage(message) {
  	socket.emit('process message', $('.user-input').val())
  }

  function flushInput(input) {
  	input.val('')
  }
})