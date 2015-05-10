'use strict'

var phrases = require('../data/phrases')
var _ = require('lodash')

function getCharacterPhrase(character, category) {
	if (!phrases[character] || !phrases[character][category]) {
		console.log("Could not find character or phrase",character,category)
		return
	}
	return _.sample(phrases[character][category])
}

module.exports = function(category) {
	var phrases = {}

	phrases.princess = (getCharacterPhrase('princess', category))
	phrases.feminist = (getCharacterPhrase('feminist', category))
	phrases.sexy = (getCharacterPhrase('sexy', category))

	return phrases
}