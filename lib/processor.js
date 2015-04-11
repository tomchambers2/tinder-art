var natural = require('natural')
var speak = require('speakeasy-nlp')
var nlp = require('nlp_compromise')
var _ = require('lodash')

var tokenizer = new natural.WordTokenizer()

module.exports = {
	processMessage: processMessage
}

function processMessage(message) {
	message = replaceWords(message)
	console.log(message)
	//words = replaceWordTypes(words)
	//var newMessage = joinMessage(words)
	return message + '<br>Positivity: ' + getPositiveScore(message).score + '<br>Negativity: ' + getNegativeScore(message).score
}

function getPositiveScore(message) {
	return speak.sentiment.positivity(message)
}

function getNegativeScore(message) {
	return speak.sentiment.negativity(message)
}

function splitMessage(message) {
	var words = message.split(' ')
	words = words.map(function(word) {
		return tokenizer.tokenize(word)[0]
	})
	return words
}

function joinMessage(words) {
	return words.join(' ')
}

function replaceWords(words) {
	for (var i = 0; i < matchedPairs.length; i++) {
		words = words.replace(matchedPairs[i].match, matchedPairs[i].replace)
	}
	return words
}

function replaceWordTypes(words) {
	return _.map(words, function(word) {
		var type = getWordType()
		if (type==='') {
			
		}
		if (type==='') {

		}
		if (type==='') {

		}
		if (type==='') {

		}
		return word
	})
}

function getWordType(word) {
	console.log(nlp.pos("I am a big dog"))
	return nlp.pos(word)
}

var matchedPairs = [
	{
		match: 'think',
		replace: 'dream'
	},
	{ 
		match: 'boyfriend',
		replace: 'prince'
	},
	{
		match: 'friend',
		replace: 'small animal'
	},
	{
		match: 'really',
		replace: 'lovely'
	},
	{
		match: 'tomorrow',
		replace: 'someday'
	},
	{
		match: 'yesterday',
		replace: 'sunny day'
	},
	{
		match: 'mum',
		replace: 'queen'
	},
	{
		match: 'text me',
		replace: 'ring the wedding bell'
	},
	{ 
		match: 'like',
		replace: 'love'
	},
	{ 
		match: 'say',
		replace: 'sing'
	},
	{ 
		match: 'laugh',
		replace: 'love'
	},
	{ 
		match: 'london',
		replace: 'castle'
	}
]

// Good luck- 
// Good luck -They can't order me to stop dreaming.
// cool/nice- oh it's beautiful
// Good night-Good night my handsome prince
// Where are you from?-you reminds mesomeone i met in the market place
// funny-It's like a dream. 
// interesting-An hundred thousand things to see
// nice-It's all so magical
// i am single-My father's forcing me to get married.


/*
levels

1. try and match the whole sentence

2. match a name or place and replace

- pick up on the sentiment of the phrase

3. pick up on exact words that match and replace

*/

/*


I'm wishing for the one I love to find me- I am single/ I am looking for friends

When you smile and you sing, everything is in tune and it's spring. - Nice/cool

You sing a song?- what are you doing? -Are you working??Are you studying?

With a smile and a song, life is just like a bright, sunny day. -good luck

Your cares fade away and your heart is young.-how older you?

He was so romantic, I couldn't resist him.- He was nice/ 

For my heart will start skipping a beat. He'll whisper "I love you" -he told me---
*/