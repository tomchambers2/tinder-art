'use strict'

module.exports = function(data) {
	this.partnerId = data.partnerId
	this.matchId = data.matchId
	console.log('Partner set to',data)
}