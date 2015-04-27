'use strict'

var Tinder = require('../../lib/tinder')
var _ = require('lodash')
var categorise = require('../../lib/categorise')
var phraseFinder = require('../../lib/phrase-finder')

module.exports = function() {
	var count = 0
	var tinder = new Tinder(this.facebookUser.userId, this.facebookUser.token)
	var self = this
	this.lastUpdate = Date.now()
    function getUpdates(matchId, partnerId, lastUpdate, callback) {
    	if (!matchId || !partnerId) {
    		console.log('Client has not set match/partner yet')
    		return setTimeout(function() { getUpdates(self.matchId, self.partnerId, self.lastUpdate, updateCallback) }, 5000)
    	}

		count++
        if (!self.connected) {
            console.log('User has disconnected, cancelling update closure');
            return;
        }
        console.log(count+': Checking for new messages')
        tinder.getUpdatesForMatch(matchId, partnerId, lastUpdate, function(err, messages) {
            if (err) callback(err)
            callback(null, messages)
        })
    }	

	function updateCallback(err, messages) {
		self.lastUpdate = Date.now()
		_.forEach(messages, function(message) {
			self.emit('chat message', { type: 'remote', message: message })
		})

		var phrases = phraseFinder(categorise(_.last(messages)))
		//var phrases = phraseFinder("hello")
		self.emit('phrases', phrases)

		setTimeout(function() { getUpdates(self.matchId, self.partnerId, self.lastUpdate, updateCallback) }, 5000)	  	
	}

	getUpdates(this.matchId, this.partnerId, this.lastUpdate, updateCallback)	
}