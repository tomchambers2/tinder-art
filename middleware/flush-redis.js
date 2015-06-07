var Redis = require('../lib/redis-client')
var redis = new Redis()

module.exports = function(req, res, next) {
	redis.flushdb()
	res.end("Redis database has been flushed. Now refresh the chat page.")
}