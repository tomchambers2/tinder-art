var express = require('express')
var app = express()
var http = require('http').Server(app)
//var helpers = require('express-helpers')(app);
var helpers = require('./lib/helpers')
require('./lib/io')(http)

var tinder = require('./lib/tinder')

app.use(express.static('public'))

app.set('view engine', 'jade')

app.locals.truncate = helpers.truncate
app.locals.timeSince = helpers.timeSince

function chat(req, res, next) {

}

app.get('/chat', function(req, res) {
	tinder.getChatPartner(function(err, partner) {
		if (err) return res.render('error', { err: err })
		res.render('chat', { partner: partner })
	})
})

app.get('/dashboard', function(req, res) {
	tinder.getMatches(function(err, matches) {
		if (err) return res.render('error', { err: err })
		res.render('dashboard', { matches: matches })
	})
})

var port = process.env.PORT || 3000
http.listen(port, function() {
	console.log('Server started', port)
})