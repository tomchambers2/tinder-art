'use strict'

var processor = require('./processor')
var Tinder = require('./tinder')
var categorise = require('./categorise')
var phraseFinder = require('./phrase-finder')
var debug = require('debug')
var _ = require('lodash')
var Redis = require('./redis-client')
var redis = new Redis

//TODO: get the user's info from a session id sent on load, lookup in redis
function getCredentials(callback) {
	redis.hgetall('facebook-user', function(err, facebookUser) {
		if (err) return callback (err)
		callback(null, facebookUser)
	})
}

function sendError(err) {
	//console.log(err)
	//socket.emit(socket, err)
}

module.exports = function(http) {
	var io = require('socket.io')(http)
	io.on('connection', function(socket){
      console.log("USER CONNECTED");

	  var partnerId
      var name
	  var matchId
	  var lastUpdate = Date.now()

	  getCredentials(startListening)

      function startListening(err, authData) {
        var tinder = new Tinder(authData.facebookUserId, authData.facebookToken)

        function getUpdates(matchId, partnerId, lastUpdate, callback) {
            if (!socket.connected) {

                console.log('User has disconnected, cancelling update closure');
                return;
            }
            console.log('Checking for new messages')
            tinder.getUpdatesForMatch(matchId, partnerId, lastUpdate, function(err, messages) {
                if (err) callback(err)
                callback(null, messages)
            })
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


                var phrases = phraseFinder(categorise(_.last(messages)))
                socket.emit('phrases', ['go away','i dont want you','leave me alone'])

    			setTimeout(function() { getUpdates(matchId, partnerId, lastUpdate, updateCallback) }, 5000)	  	
    	  	}
            
    	  	getUpdates(matchId, partnerId, lastUpdate, updateCallback)
    	  })	

          function sendMessage(remote, message) {
            socket.emit('chat message', { type: remote ? 'remote' : 'user' })
          }

          socket.on('refresh partner', function() {
            tinder.getChatPartner(function(err, match) {
                if (err) throw ('Could not get new chat partner'+err)
                    console.log('match',match);
                partnerId = match._id
                socket.emit('new partner', { name: match.person.name, partnerId: partnerId, messages: match.messages })
            })
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
      }
	})
}