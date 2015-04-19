var userIcon = '<div class="col-xs-2"><div class="user-icon"></div></div>'

var REFRESH_TIMER = 3
var FRAME_RATE = 60
var timerInnerOffset = 0
var TIMER_CACHE = []

$(document).ready(function() {
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

  socket.emit('set partner', data)

  socket.on('new partner', function(data) {
    console.log('setting new partner',data);
    $('.partner-name').text(data.name)
    $('.chat-screen').html('')
    data.messages.forEach(function(messageObj) {
      addMessage({ user: 'remote', message: messageObj.message })
    })
    var timer = new Timer()
    timer.start(function() {
      refreshPartner()
    })
  })

  socket.on('chat message',  function(chat) {
    //if (chat.type==='remote') {
      var timer = new Timer()
      timer.start(function() {
        refreshPartner()
      })
    //}
  	addMessage(chat)
  })

  $('.user-input').keyup(function(e) {
    if (e.which===13) onSubmitMessage()
  })

  $('.submit').click(onSubmitMessage)

  function onSubmitMessage() {    
  	sendMessage($('.user-input').val())
  	flushInput($('.user-input'))
  }

  function addMessage(chat) {
    var side = chat.type === 'user' ? 'right' : 'left'
    var icon = chat.type === 'user' ? userIcon : ''
    $('.chat-screen').append('<div class="row"><div class="col-xs-10"><div class="message triangle-isosceles '+side+'">'+chat.message+"</div></div>"+icon+'</div>')  	
    scrollBottom()
  }

  //addMessage({ type: 'user', message: 'blah' })

  function sendMessage(message) {
  	socket.emit('send message', $('.user-input').val())
  }

  function flushInput(input) {
  	input.val('')
  }

  function refreshPartner() {
    socket.emit('refresh partner')
  }
})