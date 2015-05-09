'use strict'

var Tinder = require('../../lib/tinder')
var _ = require('lodash')
var categorise = require('../../lib/categorise')
var phraseFinder = require('../../lib/phrase-finder')

module.exports = function(lastUpdate) {
	var tinder = new Tinder(this.facebookUser.facebookUserId, this.facebookUser.token)
	var self = this

	if (!this.matchId || !this.partnerId) {
		console.error('Client has not set match/partner yet')
	}

	console.log('Getting updates for front end since:',lastUpdate);

    tinder.getUpdatesForMatch(this.matchId, this.partnerId, lastUpdate, function updateCallback(err, messages) {
    	if (err) return console.error(err)

    	if (!messages) return

    	var filteredMessages = messages.map(function(message) {
    		console.log('Prefiltered message:',message)
    		var filteredMessage = message.replace(/jenna/i, "")
    		console.log('Filtered message:',filteredMessage)
    		return filteredMessage
    	})

		_.forEach(filteredMessages, function(message) {
			console.log('sending new message:',message);
			self.emit('chat message', { type: 'remote', message: message })
		})

		if (_.last(messages)) {
			var phrases = phraseFinder(categorise(_.last(messages)))
			console.log('UPDATE: emitting new phrases')
			self.emit('phrases', phrases)
		}
    })
}