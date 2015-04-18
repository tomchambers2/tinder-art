var Tinder = require('../lib/tinder')

module.exports = function getMatches(req, res, next) {
	var tinder = new Tinder(req.facebookUserId, req.facebookToken)
	tinder.getMatches(function(err, matches) {
		if (err) return res.render('error', { err: err })
		req.matches = matches
		next()
	})
}