var Tinder = require('../lib/tinder')

module.exports = function getBlocks(req, res, next) {
	var tinder = new Tinder(req.facebookUserId, req.facebookToken)
	tinder.getBlocks(function(err, blocks) {
		if (err) return res.render('error', { err: err })
		req.blocks = blocks
		next()
	})
}