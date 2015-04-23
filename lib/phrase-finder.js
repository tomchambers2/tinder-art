'use strict'

var phrases = require('../data/phrases')
var _ = require('lodash')

module.exports = function(category) {
	return _.sample(phrases[category], 3)
}