var Tinder = require('../lib/tinder')

module.exports = function chatController(req, res, next) {
	var tinder = new Tinder(req.facebookUserId, req.facebookToken)
	tinder.getChatPartner(function(err, partner) {
		if (err) return res.render('error', { err: err })
		req.partner = partner
		next()
	})
}	