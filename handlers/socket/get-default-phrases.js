'use strict'

var phraseFinder = require('../../lib/phrase-finder')

module.exports = function(message) {
	console.log('Getting default phrases')
	var phrases = phraseFinder('default')
	this.emit('phrases', phrases)
}