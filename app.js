var app = require('express')()
var http = require('http').Server(app)
require('./lib/io')(http)

app.get('/', function(req, res) {
	res.sendfile('views/index.html')
})

http.listen(3000, function() {
	console.log('now listening for server 3000')
})