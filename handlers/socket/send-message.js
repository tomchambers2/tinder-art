'use strict'

var Tinder = require('../../lib/tinder')

module.exports = function(message) {
	console.log('args',arguments);
	var tinder = new Tinder(this.facebookUser.facebookUserId, this.facebookUser.token)

	if (!message) {
		return console.error('Message must not be blank!')
	}

	console.log("Sending this message: "+message+" to "+this.matchId);

	tinder.sendMessage(this.matchId, message, function(err) {
		if (err) throw err
	})	
}