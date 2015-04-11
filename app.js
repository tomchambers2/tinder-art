var express = require('express')
var app = express()
var http = require('http').Server(app)
require('./lib/io')(http)

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendfile('views/index.html')
})

http.listen(process.env.PORT || 3000, function() {
	console.log('now listening for server 3000')
})