'use strict'

var Tinder = require('../../lib/tinder')
var _ = require('lodash')
var categorise = require('../../lib/categorise')
var phraseFinder = require('../../lib/phrase-finder')

module.exports = function(lastUpdate) {
	var tinder = new Tinder(this.facebookUser.userId, this.facebookUser.token)
	var self = this

	if (!matchId || !partnerId) {
		console.error('Client has not set match/partner yet')
	}

    console.log('Checking for new messages')
    tinder.getUpdatesForMatch(this.matchId, this.partnerId, lastUpdate, function updateCallback(err, messages) {
    	if (err) callback(err)
		self.lastUpdate = Date.now()
		_.forEach(messages, function(message) {
			self.emit('chat message', { type: 'remote', message: message })
		})

		if (_.last(messages)) {
			var phrases = phraseFinder(categorise(_.last(messages)))
			self.emit('phrases', phrases)
		}
    })
}