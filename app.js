var express = require('express')
var app = express()
var http = require('http').Server(app)
var routes = require('./routes')
var helpers = require('./lib/helpers')
require('./lib/io')(http)

app.use(express.static('public'))

app.set('view engine', 'jade')

app.locals.truncate = helpers.truncate
app.locals.timeSince = helpers.timeSince

routes(app)

var port = process.env.PORT || 3000
http.listen(port, function() {
	console.log('Server started', port)
})