var userIcon = '<div class="col-xs-2"><div class="user-icon"></div></div>'

var REFRESH_TIMER = 60
var FRAME_RATE = 60
var timerInnerOffset = 0
var TIMER_CACHE = []

var defaultPhrases = [
	'Hi',
	'Hi',
	'Hi'
]

$(document).ready(function() {
  setDefaultPhrases()

  var timerHeight = $('.timer').height()
  var increment = timerHeight / (REFRESH_TIMER * FRAME_RATE)

  function Timer() {
    var timerDead = false
    if (TIMER_CACHE.length) {
      for (var i = 0; i < TIMER_CACHE.length; i++) {
        TIMER_CACHE[i].killTimer()
      };
    }

    this.killTimer = function() {
      timerDead = true
    }

    this.start = function(callback) {
      timerInnerOffset = 0
      $('.timer .flashing').hide()
      $('.timer .inner').css({ 'margin-top': '0px' })
      function moveTimer() {
        if (timerDead) return
        timerInnerOffset += increment
        $('.timer .inner').css({ 'margin-top': timerInnerOffset+'px' })
        if (timerInnerOffset > timerHeight) {
          $('.timer .flashing').show()
          return callback()
        }
        setTimeout(moveTimer, 1000 / FRAME_RATE)
      }
      moveTimer()
    }

    TIMER_CACHE.push(this)
  }

  var timer = new Timer()
  timer.start(function() {
    refreshPartner()
  })

  function scrollBottom() {
    $('.chat-screen').animate( { scrollTop: $('.chat-screen')[0].scrollHeight }, 1000)
  }

  scrollBottom()

  var socket = io();

  socket.on('connect', function() {
    console.info("Websocket connected")
    $('.error').hide()
  })

  socket.on('disconnect', function() {
    console.error("Error: lost websocket connection")
    $('.error').show()
  })

  socket.on('request partner', function() {
    console.log('Will send loaded partner to server');
    socket.emit('set partner', data)
  })

  function setDefaultPhrases() {
    resetPhrases()
	  $('.phrase').each(function(index) {
      $(this).text(defaultPhrases[index])
    })  	
  }

  socket.on('new partner', function(data) {
  	setDefaultPhrases()

    console.log('setting new partner',data);
    $('.partner-name').text(data.name)
    $('.chat-screen').html('')
    data.messages.forEach(function(messageObj, i) {
      var type = (messageObj.from === data.partnerId) ? 'remote' : 'user';
      console.log('message typ remote?',type);
      var push = (i === data.messages.length - 1) ? true : false;
      addMessage({ type: type, message: messageObj.message }, push)
    })
    if (data.messages.length) {
    	socket.emit('categorise', _.last(data.messages).message)
    }
    var timer = new Timer()
    timer.start(function() {
      refreshPartner()
    })
  })

  socket.on('chat message',  function(chat) {
    console.log('Received a new message',chat);
    if (chat.type==='remote') {
      var timer = new Timer()
      timer.start(function() {
        refreshPartner()
      })
    }
  	addMessage(chat)
  })

  var messages = _.filter(data.messages, function(message) {
    return message.from === data.partnerId
  })

  if (messages.length) {
  	setCategory(messages)
  }

  function setCategory(messages) {
  	console.log('will cat',_.last(messages).message);
  	socket.emit('categorise', _.last(messages).message)  	
  }

  socket.on('phrases', function(phrases) {
    resetPhrases()
    $('.phrase').each(function(index) {
      $(this).text(phrases[index])
    })
  })

  /* test chat only */
  $('.user-input').keyup(function(e) {
    if (e.which===13) onSubmitInput()
  })

  $('.submit').click(onSubmitInput)


  function onSubmitInput() {  
    console.log('submitting input:',$('.user-input').val());  
    sendMessage($('.user-input').val())
    addMessage({ type: 'user', message: $('.user-input').val() })
    flushInput($('.user-input'))
  }  

  $('.phrase').click(onSubmitMessage)

  function slideAwayPhrases(selectedCharacter) {
    $('.phrase').each(function(index, phrase) {
      if ($(this).data('character') === selectedCharacter) return
      $('.'+$(this).data('character')+'-container').hide('slide', { direction: 'right' }, 800)
    })
  }

  function removePhrase(selectedCharacter) {
    $('.'+selectedCharacter).fadeOut(800, function() {
          $(this).css({"visibility":"hidden"});
          $(this).css({"display":"block"});
    });    
  }

  function resetPhrases() {
    $('.phrase').each(function(i, phrase) {
      $(this).show()
    })
  }

  function onSubmitMessage() {  
    //console.log('sending a message',$(this).text());  
    if (!$(this).text()) {
      console.log("User attempted to send a blank message")
      return
    }

  	//sendMessage($(this).text())

    removePhrase($(this).data('character'))
    slideAwayPhrases($(this).data('character'))

    addMessage({ type: 'user', message: $(this).text() })
  }

  function addMessage(chat, dontPush) {
  	console.log('adding',chat.message,'with type',chat.type);
    var side = chat.type === 'user' ? 'right' : 'left'
    var icon = chat.type === 'user' ? userIcon : ''
    var icon = ''
    $('.chat-screen').append('<div class="row"><div class="col-xs-10"><div class="message triangle-isosceles '+side+'">'+chat.message+"</div></div>"+icon+'</div>')  	
    if (dontPush) return
    scrollBottom()
  }

  function sendMessage(message) {
  	socket.emit('send message', message)
  }

  function flushInput(input) {
  	input.val('')
  }

  function refreshPartner() {
    socket.emit('refresh partner')
  }

  function getUpdates() {
    var timer = setTimeout(function() {
      socket.emit('get updates', data.lastUpdate)
      getUpdates()
    }, 5000)
  }
  getUpdates()
})