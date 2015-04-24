var express = require('express')
var app = express()
var config = require('./data/config')
var http = require('http').Server(app)
var routes = require('./routes')
var helpers = require('./lib/helpers')
var io = require('./lib/io')(http)
var socketRoutes = require('./socket-routes')

app.use(express.static('public'))

app.use(function(err, req, res, next) {
	console.log('Caught an error!',err)
});

app.set('view engine', 'jade')

app.locals.truncate = helpers.truncate
app.locals.timeSince = helpers.timeSince

routes(app)
socketRoutes(io)

var port = process.env.PORT || 3000
http.listen(port, function() {
	console.log('Server started', port)
})