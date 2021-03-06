var facebookCookie = require('../data/facebook-cookie')
var Redis = require('../lib/redis-client')
var redis = new Redis()
var request = require('request')
var url = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token'
var options = {
  url: url,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
  }
}
var userId = '100009628062333'

function getCredentials(callback) {
	redis.hgetall('facebook-user', function(err, facebookUser) {
		if (err) return callback (err)
		callback(null, facebookUser)
	})
}

function refreshCredentials(callback) {
	var request = require('request')
	var j = request.jar()
	var request = request.defaults({ jar: j })

	for (var i = 0; i < facebookCookie.length; i++) {
		var cookie = request.cookie(facebookCookie[i].name +'='+ facebookCookie[i].value)
		j.setCookie(cookie, url)
	};

	request(options, function(err, response, body) {
		var access_token = /access_token=([a-zA-Z0-9]+)/.exec(response.request.uri.hash)
		var expiresIn = /expires_in=([0-9]+)$/.exec(response.request.uri.hash)
		if (!access_token || !expiresIn) return callback('Facebook cookie appears to have expired');
		storeCredentials(access_token[1], userId, expiresIn[1])

		callback(err, userId, access_token[1])
	})

}

function storeCredentials(token, userId, expiresIn) {
	console.log('Storing crentials to expire in',expiresIn);
	redis.hmset('facebook-user', { userId: userId, token: token }, function(err, reply) {
		if (err) throw err
		redis.expire('facebook-user', expiresIn)
	})
}

var self = this

module.exports = function(req, res, next) {
	getCredentials(function(err, facebookUser) {
		if (err) return next(err)
		if (!facebookUser) return refreshCredentials(function(err, userId, token) {
			if (err) return next(err)
			req.facebookUserId = userId
			req.facebookToken = token
			next()
		})
		console.log('Credentials retrieved from redis');
		req.facebookUserId = facebookUser.userId
		req.facebookToken = facebookUser.token
		next()
	})
}

