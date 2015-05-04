var Tinder = require('../lib/tinder')

module.exports = function chatController(req, res, next) {
	var tinder = new Tinder(req.facebookUserId, req.facebookToken)
	tinder.getChatPartner(function(err, partner) {
		if (err) return res.render('error', { err: err })
		if (!partner.person) {
			partner.person = {
				_id: null,
				name: 'Unknown'
			}
		}
		req.partner = partner
		next()
	})
}	