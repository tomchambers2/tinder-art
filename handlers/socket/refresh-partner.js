'use strict'

var Tinder = require('../../lib/tinder')

module.exports = function() {
	var tinder = new Tinder(this.facebookUser.facebookUserId, this.facebookUser.token)
	
	var self = this
	tinder.getChatPartner(function(err, match) {
	    if (err) throw ('Could not get new chat partner'+err)
		if (!match.person) {
			match.person = {
				_id: null,
				name: 'Unknown'
			}
		}	
	    self.matchId = match._id
	    self.partnerId = match.person._id
	    self.emit('new partner', { name: match.person.name, matchId: self.matchId, partnerId: self.partnerId, messages: match.messages })
	})
}