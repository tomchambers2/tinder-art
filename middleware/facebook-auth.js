var Redis = require('../lib/redis-client')
var redis = new Redis()
var request = require('request')
var config = require('../config')
var async = require('async')
var moment = require('moment')

function getCode(req) {
	return function(callback) {
		callback(null, req.query.code)
	}
}

function getToken(code, callback) {
	request({
		url: 'https://graph.facebook.com/oauth/access_token?code='+code+'&client_secret='+config.clientSecret+'&client_id='+config.clientId+'&redirect_uri='+config.redirectUri,
	    method: 'GET'
	}, function(err, response, body){
	    if (err) return callback(err)

		var access_token = /^access_token=([a-zA-Z0-9]+)/.exec(body)
		var expiry = /expires=([0-9]+)$/.exec(body)
		if (!access_token) return callback('Error returned'+body)
		callback(null, access_token[1])
	})
}

function getUserId(token, callback) {
	request({
		url: 'https://graph.facebook.com/debug_token?input_token=' + token + '&access_token=' + config.clientId + '|' + config.clientSecret,
	    method: 'GET'
	}, function(err, response, body){
	    if (err) return callback(err)
        body = JSON.parse(body)
        if (!body.data.user_id) {
        	return callback("Could not get user id")
        }
        callback(null, token, body.data.user_id, body.data.expires_at)
	})	
}

function storeCredentials(token, userId, expires_at, callback) {
	var expiry = moment(expires_at).subtract(moment()).unix()
	redis.hmset('facebook-user', { userId: userId, token: token }, function(err, reply) {
		if (err) return callback(err)
		callback(null, token, userId)
		redis.expire('facebook-user', expiry)
	})
}

function getCredentials(callback) {
	redis.hgetall('facebook-user', function(err, facebookUser) {
		if (err) return callback (err)
		callback(null, facebookUser)
	})
}

module.exports = function(req, res, next) {
	if (req.query.code) {
		async.waterfall([
			getCode(req),
			getToken,
			getUserId,
			storeCredentials
			//TODO: set a cookie with a hash/random string to store users
		], function(err, token, userId) {
			console.log('returning',userId);
			if (err) return next(err)
			req.facebookUserId = userId,
			req.facebookToken = token
			next()
		})
	} else {
		//TODO: get the user from a sessionId/cookie instead of single user in redis
		getCredentials(function(err, facebookUser) {
			if (err) return next(err)
			if (!facebookUser) return res.redirect('/login')
			req.facebookUserId = facebookUser.userId
			req.facebookToken = facebookUser.token
			next()
		})
	}
}