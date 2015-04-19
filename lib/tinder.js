var async = require('async')
var _ = require('lodash')
var debug = require('debug')
var moment = require('moment')
var TinderPro = require('tinder_pro')

var CACHE_LENGTH = 60000
var TINDER_CACHE = []

var TinderClient = function(userId, token) {
	if (TINDER_CACHE[userId]) {
		return TINDER_CACHE[userId]
	}
	TINDER_CACHE[userId] = this

	var cache = {
		data: null,
		expiry: null
	}
	this.userId = userId
	this.token = token
	this.authed = false

	var currentPartner = null
	var deadPartners = []

	var tinder = new TinderPro()

	function _sortMatches(matches, callback) {
		callback(null, _.sortByOrder(matches, 'last_activity_date', false))
	}

	function _filterMessages(matchId, partnerId, updates) {
		var match = _.findWhere(updates.matches, { _id: matchId })
		if (!match) return
		var remoteMessages = _.where(match.messages, { from: partnerId })
		return [].concat(remoteMessages)
	}

	function _getUpdatesSince(since) {
		var dateLastUpdate = moment(since)
		return function(callback) {
			tinder.fetch_updates_since(dateLastUpdate, function(err, res, updates) {
				if (err) return callback(err)
				if (res.statusCode!=200) return callback("non 200 status code")
				callback(null, updates)
			})
		}
	}

	function _getUpdates(callback) {
		if (testCache(cache)) return callback(null, cache.data)
		tinder.fetch_all_updates(function(err, res, data) {
			if (err) return callback(err)
			if (res.statusCode!=200) return callback(data.error)
			setCache(cache, data)
			callback(null, data)
		})
	}

	function _getMatches(callback) {
		_getUpdates(function(err, data) {
			if (err) return callback(err)
			callback(null, data.matches)
		})	
	}

	function _getBlocks(callback) {
		_getUpdates(function(err, data) {
			if (err) return callback(err)
			callback(null, data.blocks)
		})	
	}

	function _pickTopMatch(matches, callback) {
		var topMatch = _.find(matches, function(match) {
			return !!!match.dead
		})
		callback(null, topMatch)
	}

	function _sendMessage(matchId, message, callback) {
		tinder.send_message(matchId, message, function(err, res, data) {
			if (err) return callback(err)
			if (res.statusCode!=200) return callback(data.error)
			debug("Sent message:",message,"message to matchId:",matchId)
		})
	}

	function _auth(callback) {
		if (this.authed) return callback(null)
		//console.log(this.userId)
		//this.userId = '1386672264992119'
		//this.token = 'CAAGm0PX4ZCpsBABxvPdsfxlOnxEEQTsyWZB7fFkoapC2MN8p4dZA279bP4NuEHUWMKALl5pkzSiZCdIIkgBT0BRLybHjGgAiKs6V9ljRVr98q3GvguNeUyoXuxM9fbVB9vVEqzOHkzZCqGpgBsxAafMhZBsyS1LpRwZAuXI27YkxSRDVrl77QkwOWiNPuUUKs0c0m9tyqSdyWPZChKPkD2fX'
		console.log('used in the auth', this.userId, this.token);
		tinder.sign_in(this.userId, this.token, function(err, res, body){
			if (err) return err
			if (body.code == 500) return callback("Auth failed. Access denied. Facebook auth failed. "+JSON.stringify(body)) 
			if (body.status == 401) return callback("Auth failed. "+JSON.stringify(body))
			authed = true
			return callback(null)
		})
	}

	function _getNearbyUsers(callback) {
		tinder.get_nearby_users(function(err, res, data) {
			if (err) return callback(err)
			if (_.find(data.results, function(user) {
				return /tinder_rate_limited/.exec(user._id)
			})) return callback("Daily limit exceeded!")
			callback(null, data.results)
		})	
	}

	function _likeUsers(users, callback) {
		var startTime = Date.now()
		var stats = {
			attempts: users.length,
			likes: 0,
			matches: 0,
			fails: 0,
			totalTime: 0
		}
		var matches = []
		async.eachLimit(users, 2, function(user, callback) {
			tinder.like(user._id, function(err, res, reply) {
				if (err) {
					stats.fails++
				} else {
					stats.likes++
				}
				if (reply.match) {
					stats.matches++
					matches.push(reply.match)
				}
				callback()
			})
		}, function(err) {
			if (err) callback(err)
			stats.totalTime = Date.now() - startTime
			callback(null, { stats: stats, matches: matches })
		})
	}

	function _killOldPartner(callback) {
		deadPartners.push(currentPartner)
		callback()
	}

	function _killUser(userId) {
		return function(matches, callback) {
			if (!_.find(matches, { _id: userId })) return callback('Match does not exist')
			deadPartners.push(userId)
			callback()
		}
	}

	function _markDeadUsers(matches, callback) {
		matches.map(function(match) {
			if (deadPartners.indexOf(match._id)>-1) match.dead = true
			if (currentPartner===match._id) match.active = true
			return match
		})
		callback(null, matches)
	}

	this.generateMatches = function(callback) {
		async.waterfall([
			_auth.bind(this),
			_getNearbyUsers,
			_likeUsers
		], function(err, generatedMatchesStats) {
			if (err) {
				return callback(err)
			}
			return callback(err, generatedMatchesStats)
		})
	}
	this.getMatches = function(callback) {
		async.waterfall([
			_auth.bind(this),
			_getMatches,
			_markDeadUsers,			
			_sortMatches
		], function(err, results) {
			if (err) return callback(err)
			return callback(err, results)
		})
	}
	this.getBlocks = function(callback) {
		async.waterfall([
			_auth.bind(this),
			_getBlocks
		], function(err, results) {
			if (err) return callback(err)
			return callback(err, results)
		})
	}	
	this.getUpdatesForMatch = function(matchId, partnerId, since, callback) {
		async.waterfall([
			_auth.bind(this),
			_getUpdatesSince(since)
		], function(err, allUpdates) {
			if (err) return callback(err)
			var filteredUpdates = _filterMessages(matchId, partnerId, allUpdates)
			if (!filteredUpdates) return callback()
			var messages = _.pluck(filteredUpdates, 'message')
			callback(null, messages)
		})
	}
	this.killUser = function(userId, callback) {
		async.waterfall([
			_auth.bind(this),
			_getMatches,
			_killUser(userId)
		], function(err) {
			if (err) return callback(err)
			callback(null)
		})
	}
	this.getChatPartner = function(callback) {
		async.waterfall([
			_killOldPartner,
			_auth.bind(this),
			_getMatches,
			_markDeadUsers,
			_sortMatches,
			_pickTopMatch
		], function(err, match) {
			if (err) return callback(err)
			currentPartner = match._id
			callback(null, match)
		})
	}
	this.sendMessage = function(matchId, message, callback) {
		_sendMessage(matchId, message, callback)
	}	
}

function testCache(cache) {
	return cache.expiry > Date.now() - CACHE_LENGTH
}

function setCache(cache, data) {
	cache = {
		data: data,
		expiry: Date.now()
	}
}

module.exports = TinderClient