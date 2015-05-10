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
  var currentUser = data
  
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
	  $('.user-input').each(function(index) {
      $(this).val(defaultPhrases[index])
    })  	
  }

  socket.on('new partner', function(data) {
    console.log('setting new partner',data);

    setDefaultPhrases()

    $('.partner-name').text(data.name)
    $('.chat-screen').html('')
    console.log('new data',data);
    if (data.photoUrl) {
      currentUser.photoUrl = data.photoUrl
      $('.face.main-man').attr('src', currentUser.photoUrl)
    }
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

  function setCategory(messages) {
  	console.log('will cat',_.last(messages).message);
  	socket.emit('categorise', _.last(messages).message)  	
  }

  socket.on('phrases', function(phrases) {
    console.log('Phrases event, new phrases will be set', phrases);
    resetPhrases()
    $('textarea[data-character="princess"]').val(phrases.princess)
    $('textarea[data-character="feminist"]').val(phrases.feminist)
    $('textarea[data-character="sexy"]').val(phrases.sexy)
  })

  $('.submit').click(onSubmitInput)

  function onSubmitInput(e) {  
    var character = $(e.target).data('character')

    if (!$('.user-input').val()) return
    console.log('submitting input:',$('.user-input[data-character="'+character+'"]').val())
    sendMessage($('.user-input[data-character="'+character+'"]').val())
    addMessage({ type: 'user', character: character, message: $('.user-input').val() })
    flushInput($('.user-input'))
    //slideAwayPhrases();
  }  

  function slideAwayPhrases(selectedCharacter) {
    console.log('sliding away others');
    $('.input-bar').each(function(index, phrase) {
      console.log(this);
      //if ($(this).data('character') === selectedCharacter) return
        console.log('passed check');
      $(this).slideDown('2000', function() {
        console.log('done');
      })
    })
  }

  function resetPhrases() {
    $('.user-input').each(function(i, phrase) {
      $(this).show()
    })
  }

  function addMessage(chat, dontPush) {
    console.log('adding',chat.message,'with type',chat.type);
    var side = chat.type === 'user' ? 'right' : 'left'
    remoteIcon = chat.type === 'user' ? '' : '<div class="col-xs-2"><img class="face" src="'+currentUser.photoUrl+'"></div>'
    localIcon =  chat.type === 'user' ? '<div class="col-xs-2"><div class="face '+chat.character+'"></div></div>' : ''
    $('.chat-screen').append('<div class="row">'+remoteIcon+'<div class="col-xs-10"><div class="message triangle-isosceles '+side+'">'+chat.message+"</div></div>"+localIcon+"</div>")  	
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
      console.log('getting new updates since:',data.lastUpdate);
      socket.emit('get updates', data.lastUpdate)
      data.lastUpdate = Date.now()
      getUpdates()
    }, 5000)
  }

  var messages = _.filter(data.messages, function(message) {
    return message.from === data.partnerId
  })

  if (messages.length) {
    setCategory(messages)
  }  
  
  getUpdates()

  setDefaultPhrases()

  scrollBottom()
})