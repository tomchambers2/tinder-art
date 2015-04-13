var tinder = require('../lib/tinder')

module.exports = function getMatches(req, res, next) {
	tinder.getMatches(function(err, matches) {
		if (err) return res.render('error', { err: err })
		req.matches = matches
		next()
	})
}