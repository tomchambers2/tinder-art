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
	var phrases = []

	phrases.push(getCharacterPhrase('princess', category))
	phrases.push(getCharacterPhrase('feminist', category))
	phrases.push(getCharacterPhrase('sexy', category))

	console.log('Returning prhases: ',phrases);

	return phrases
}