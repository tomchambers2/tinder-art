'use strict'

var dirtyFacebookAuth = require('../../lib/dirty-facebook-auth')

module.exports = {
	attachCredentials: function(socket, next) {
		dirtyFacebookAuth.getCredentials(function(err, facebookUser) {
			if (err) return next(err)
			socket.facebookUser = facebookUser
			console.log("SET socket facebook user to:",socket.facebookUser);
			next()
		})
	}
}