var redis = require('redis')
var url = require('url')

var client = function() {
	if (process.env.REDISCLOUD_URL) {
		console.log('Connecting to remote redis');
		var redisUrl = url.parse(process.env.REDISCLOUD_URL)

		this.client = redis.createClient(redisUrl.port, redisUrl.hostname, { no_ready_check: true })
		this.client.auth(redisUrl.auth.split(':')[1])
	} else {
		console.log('Connecting to local redis');
		this.client = redis.createClient()
	}

	this.client.on("error", function(err) {
		console.log('Redis error:',err)
	})

	return this.client
}

module.exports = client