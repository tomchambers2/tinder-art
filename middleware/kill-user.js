var Tinder = require('../lib/tinder')

module.exports = function getMatches(req, res, next) {
	var tinder = new Tinder(req.facebookUserId, req.facebookToken)
	tinder.killUser(req.params.userId, function(err) {
		if (err) return next(err)
		next()
	})
}