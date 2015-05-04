'use strict'

var natural = require('natural')
var data = require('../data/training-data')
var _ = require('lodash')

var classifier = new natural.BayesClassifier()

train(data)
  
module.exports = function(text) {
	if (!text) {
		console.error("Classifier: No text provided to classify")
		return
	}
	//console.log("Will classify: ",text);
	var category = classifier.classify(text)
	var results = classifier.getClassifications(text)
	//console.log('Categorised as:',category);
	//console.log('Other results:',_.sortBy(results, 'value'));
	return category
}

function train(data) {
	data.forEach(function(phrase) {
		classifier.addDocument(phrase.document, phrase.category)
	})

	classifier.train()
}