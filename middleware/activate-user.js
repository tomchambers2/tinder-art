var emitter = require('../lib/eventemitter')

module.exports = function getMatches(req, res, next) {
	emitter.emit('activate user', req.params.userId)
	next()
}