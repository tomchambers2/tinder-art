'use strict'

var phrases = require('../data/phrases')
var _ = require('lodash')

function getCharacterPhrase(character, category) {
	if (!phrases[character] || !phrases[character][category]) {
		console.log("Could not find character or phrase")
		return 
	}
	return _.sample(phrases.princess[category])
}

module.exports = function(category) {
	var phrases = []

	phrases.push(getCharacterPhrase('cinderella', category))
	phrases.push(getCharacterPhrase('feminist', category))
	phrases.push(getCharacterPhrase('barbie', category))

	return phrases
}