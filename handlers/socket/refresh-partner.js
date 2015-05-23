'use strict'

var Tinder = require('../../lib/tinder')
var characterFinder = require('../../lib/character-finder')

module.exports = function() {
	var tinder = new Tinder(this.facebookUser.facebookUserId, this.facebookUser.token)
	
	var self = this
	tinder.getChatPartner(function(err, match) {
	    if (err) return console.error('Refresh partner: could not get new chat partner. ERR: '+err)
		if (!match.person) {
			match.person = {
				_id: null,
				name: 'Unknown'
			}
		}

		match.messages = match.messages.map(function(messageObj) {
			messageObj.character = characterFinder(messageObj.message)
			return messageObj
		})

	    self.matchId = match._id
	    self.partnerId = match.person._id
	    self.emit('new partner', { photoUrl: match.person.photos[0].url, name: match.person.name, matchId: self.matchId, partnerId: self.partnerId, messages: match.messages })
	})
}