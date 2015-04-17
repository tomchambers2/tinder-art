var tinder = require('../lib/tinder')

module.exports = function getBlocks(req, res, next) {
	tinder.getBlocks(function(err, blocks) {
		if (err) return res.render('error', { err: err })
			console.log('blocks in middlware',blocks);
		req.blocks = blocks
		next()
	})
}