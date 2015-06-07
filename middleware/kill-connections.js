var emitter = require('../lib/eventemitter')

module.exports = function(req, res, next) {
	emitter.emit('kill connections')
	res.end("Killed all connections")
}