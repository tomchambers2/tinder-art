var _ = require('lodash')
var characterFinder = require('../lib/character-finder')

module.exports = function(req, res, next) {
	req.partner.messages = req.partner.messages.map(function(messageObj) {
		messageObj.character = characterFinder(messageObj.message)
		return messageObj
	})

	next()
}