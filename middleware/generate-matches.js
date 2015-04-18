var Tinder = require('../lib/tinder')

module.exports = function(req, res, next) {
	var tinder = new Tinder(req.facebookUserId, req.facebookToken)
	
	var matchesCb = function(err, results) {
		if (err) {
			req.generateErr = err
			return next()
		}

		req.generateResults = results

		next()
	}
	
	tinder.generateMatches(matchesCb)
}