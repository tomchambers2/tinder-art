var tinder = require('../lib/tinder')

module.exports = function chatController(req, res, next) {
	tinder.getChatPartner(function(err, partner) {
		if (err) return res.render('error', { err: err })
		req.partner = partner
		next()
	})
}	