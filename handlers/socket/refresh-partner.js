'use strict'

var Tinder = require('../../lib/tinder')

module.exports = function() {
	var tinder = new Tinder(this.facebookUser.userId, this.facebookUser.token)

	var self = this
	tinder.getChatPartner(function(err, match) {
	    if (err) throw ('Could not get new chat partner'+err)
	    //console.log('match',match);
	    self.partnerId = match._id
	    self.emit('new partner', { name: match.person.name, partnerId: self.partnerId, messages: match.messages })
	})
}