'use strict'

var characters = require('../data/phrases')
var _ = require('lodash')

module.exports = function(phrase) {
	var result = _.find(characters, function(character) {
		return _.some(character, function(phrases) {
			return _.contains(phrases, phrase)
		})
	})
	if (!result) return
	return result.title
}