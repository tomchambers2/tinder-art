var redis = require('redis')

var client = function() {
	this.client = redis.createClient()

	this.client.on("error", function(err) {
		console.log('Redis error:',err)
	})

	return this.client
}

module.exports = client