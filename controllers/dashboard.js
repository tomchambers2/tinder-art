var tinder = require('../lib/tinder')

module.exports = function dashboardController(req, res) {
	res.render('dashboard', { matches: req.matches, stats: req.stats })
}	