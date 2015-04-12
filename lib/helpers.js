'use strict'

var moment = require('moment')

module.exports = {
	truncate: function(string) {
		return string.substring(0, 4)+'...'
	},
	timeSince: function(date) {
		return moment(date).fromNow()
	}
}