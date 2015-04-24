'use strict'

var phrases = require('../data/phrases')
var _ = require('lodash')

function getCharacterPhrase(character, category) {
	if (!phrases[character] || !phrases[character][category]) return console.log("Could not find character or phrase")
	return _.sample(phrases.cinderella[category])
}

module.exports = function(category) {
	var phrases = []

	phrases.push(getCharacterPhrase('cinderella', category))
	phrases.push(getCharacterPhrase('feminist', category))
	phrases.push(getCharacterPhrase('barbie', category))

	return phrases
}