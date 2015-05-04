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

    tinder.getUpdatesForMatch(this.matchId, this.partnerId, lastUpdate, function updateCallback(err, messages) {
    	if (err) return console.error(err)

    	if (!messages) return

    	messages = messages.map(function(message) {
    		return message.replace(/jenna/i, "")
    	})

		_.forEach(messages, function(message) {
			self.emit('chat message', { type: 'remote', message: message })
		})

		if (_.last(messages)) {
			var phrases = phraseFinder(categorise(_.last(messages)))
			self.emit('phrases', phrases)
		}
    })
}