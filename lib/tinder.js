var async = require('async')

var FACEBOOK_ID = "100009480757843"
 
var FACEBOOK_TOKEN = "CAAGm0PX4ZCpsBALAH6aD1BHZAgJvyOTpZAU1faZBsQdQfXvPiXWyeaAvgsXUaVfmLrhRDmRF72bNcH1WynPZAaCCg7J3gIup4e4ZBbRoYKH8Qq00NEzIS1YZCsUZCkIhah9JQEXS4Kvth0Ur6HBfFvZBF9uZCle82q9qdydC2KS9TTGojmCY5kevSr4ZC6d5k2nvLsqvwPpkYq3PWkjjaE5EDS1"

var TinderPro = require('tinder_pro')
var tinder = new TinderPro()

//on start, get list of matches

//keep on liking every person that comes through (deal with rate limiting)

//

//maintain a queue of active matches
	//match has an identity used to direct messages to them
	//each person has a last_response key
	//continually sort by last_response key when getting
 
tinder.sign_in(FACEBOOK_ID, FACEBOOK_TOKEN, function(err, res, body){
	if (err) return err
	console.log('success?');

	// tinder.update_location(51.5072, 0.1275, function(err, res, body) {
	// 	console.log(body)
	// })

	// 	process.exit(0)

	tinder.fetch_updates(function(err, res, body) {
		console.log(body);
	})

	// async.waterfall([
	// 	updateLocation,
	// 	getNearbyUsers,

	// ], function(err, result) {
	// 	//console.log(result[1].results);
	// 	if (err) return err
	// 		console.log(result);
	// 	for (var i = 0; i < result[0].results.length; i++) {
	// 		console.log(result[0].results[i]);
	// 	};
	// })


	function updateLocation(callback) {
		tinder.update_location(51.5072, 1.1275, function(err, res, body) {
			callback(null, body)
		})
	}

	function getNearbyUsers(callback) {
		tinder.get_nearby_users(function(err, res, body) {
			callback(null, body)
		})
	}
})