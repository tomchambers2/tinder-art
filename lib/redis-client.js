var redis = require('redis')
var url = require('url')

var client = function() {
	var redisUrl = url.parse(process.env.REDISCLOUD_URL)

	this.client = redis.createClient(redisUrl.port, redisUrl.hostname, { no_ready_check: true })
	this.client.auth(redisUrl.auth.split(':')[1])

	this.client.on("error", function(err) {
		console.log('Redis error:',err)
	})

	return this.client
}

module.exports = client