var tinder = require('../lib/tinder')

module.exports = function(req, res, next) {
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