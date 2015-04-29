'use strict'

var Tinder = require('../../lib/tinder')
var _ = require('lodash')
var categorise = require('../../lib/categorise')
var phraseFinder = require('../../lib/phrase-finder')

module.exports = function(message) {
	console.log('Categorising',message);
	var phrases = phraseFinder(categorise(message))
	this.emit('phrases', phrases)
}