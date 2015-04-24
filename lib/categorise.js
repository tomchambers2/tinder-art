'use strict'

var natural = require('natural')
var data = require('../data/training-data')

var classifier = new natural.BayesClassifier()

train(data)
  
module.exports = function(text) {
	return classifier.classify(text)
}

function train(data) {
	data.forEach(function(phrase) {
		classifier.addDocument(phrase.document, phrase.category)
	})

	classifier.train()
}