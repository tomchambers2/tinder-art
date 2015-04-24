var config = require('../../data/config')

module.exports = function loginController(req, res) {
	res.render('login', { clientId: config.clientId })
}