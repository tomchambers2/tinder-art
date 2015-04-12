var async = require('async')
var _ = require('lodash')
var debug = require('debug')

var FACEBOOK_ID = "100009480757843"
 
var FACEBOOK_TOKEN = "CAAGm0PX4ZCpsBAGNRE5FtDMhiL9FTQIpCcbRBdyBjp4Sp8rbqgKEFtzJo9xzVMQMpGAhM3usix61d6zq0yiZA5zo28jNhQAkHD1DtDGaWVBXDTFJMZBqlgQZBZCDvoZB8t6UZAobLbg7rPhjlMVF8EeS6xhfyRTmCzEfAgRaHaElmoS6jDgq2zJY71v5fZAiwahOb6g9TsWY8dpUfYusSiac"

var TinderPro = require('tinder_pro')
var tinder = new TinderPro()

var authed = false
var matchCache = []
var currentRemoteUserId //stores the id of the man on tinder

module.exports = {
	getMatches: function(callback) {
		if (matchCache.length) return callback(null, matchCache)
		async.waterfall([
			_auth,
			_getMatches,
			_sortMatches
		], function(err, results) {
			if (err) return callback(err)
			return callback(err, results)
		})
	},
	getChatPartner: function(callback) {
		async.waterfall([
			_auth,
			_getMatches,
			_sortMatches,
			_pickTopmatch
		], function(err, match) {
			if (err) return callback(err)
			callback(null, match)
		})
	},
	sendMessage: function(user_id, message, callback) {
		_sendMessage(user_id, message, callback)
	}
}

//boot up
	//find nearby people - like them all
	//fetch UPDATES
		//get all matches and store in memory, sort by last_activity_date

		//new chats
			//check if matches currently selected user and send to frontend

		//set timer to fetch updates every 5 seconds - call with time limit param

	//export function to pick someone off the queue on request
		//get the person with highest last_activity_date and give userid
		//set up a socket to send any new messages from them

	//export function to send message
		//take a user_id and message, call tinder endpoint

function _sortMatches(matches, callback) {
	callback(null, _.sortByOrder(matches, 'last_activity_date', false))
}

function _getMatches(callback) {
	if (matchCache.length) return callback(null, matchCache)
	tinder.fetch_all_updates(function(err, res, data) {
		if (err) return callback(err)
		if (res.statusCode!=200) return callback(data.error)
		callback(null, data.matches)
	})	
}

function _pickTopmatch(matches, callback) {
	callback(null, matches[0])
}

function _sendMessage(user_id, message, callback) {
	tinder.send_message(user_id, message, function(err, res, data) {
		if (err) return callback(err)
		debug("Sent message:",message,"message to",user_id)
	})
}

function _auth(callback) {
	if (authed) return callback(null)
	tinder.sign_in(FACEBOOK_ID, FACEBOOK_TOKEN, function(err, res, body){
		if (err) return err
		authed = true
		return callback(null)


		// tinder.get_nearby_users(function(err, res, data) {
		// 	//likeUser(data.results[0]._id)
		// 	//return
		// 	if (data.status != 200) {
		// 		//BACK THE FUCK OFF FOR A BIT OK?
		// 		return
		// 	}
		// 	data.results.forEach(function(user) {
		// 		likeUser(user._id)
		// 	})
		// 	//call self again to do the liking shit
		// })	

		// function likeUser(user_id) {
		// 	tinder.like(user_id, function(err, res, body) {
		// 		if (err) return err
		// 	})
		// }

		// function getNearbyUsers(callback) {
		// 	tinder.get_nearby_users(function(err, res, body) {
		// 		callback(null, body)
		// 	})
		// }	

		// tinder.fetch_updates_since(100, function(err, res, data) {
		// 	matches = data.matches
		// })

		// async.waterfall([
		// 	updateLocation,
		// 	getNearbyUsers,

		// ], function(err, result) {
		// 	if (err) return err
		// 	for (var i = 0; i < result[0].results.length; i++) {
		// 	};
		// })


		// function updateLocation(callback) {
		// 	tinder.update_location(51.5072, 1.1275, function(err, res, body) {
		// 		callback(null, body)
		// 	})
		// }


	})
	
}