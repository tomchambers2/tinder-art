var _ = require('lodash')
var moment = require('moment')

module.exports = function(req, res, next) {
	if (!req.matches.length) {
		req.stats = {
			totalMatches: 0,
			matchRate: 0,
			firstMatch: 'Unmatched',
			blocks: 0
		}		
		return next()
	}

	var matchesWithReplies = _.filter(req.matches, function(match) {
		return match.messages.length
	})

	req.stats = {
		totalMatches: req.matches.length,
		matchRate: matchesWithReplies.length / req.matches.length,
		firstMatch: moment(req.matches[req.matches.length-1].created_date),
		blocks: req.blocks.length
	}

	next()
}