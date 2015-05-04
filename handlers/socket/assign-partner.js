'use strict'

var Tinder = require('../../lib/tinder')

module.exports = function(userId) {
	var tinder = new Tinder(this.facebookUser.facebookUserId, this.facebookUser.token)
	
	var self = this
	console.log('wil get');
	tinder.getChatPartnerDetails(userId, function(err, match) {
		console.log('GOT A NEW USER?',match);
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