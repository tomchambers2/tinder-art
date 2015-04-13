var chatController = require('./controllers/chat')
var dashboardController = require('./controllers/dashboard')

var logger = require('./middleware/logger')

var getMatches = require('./middleware/get-matches')
var getChatPartner = require('./middleware/get-chat-partner')
var generateStats = require('./middleware/generate-stats')

module.exports = function(app) {
	app.get('/chat', logger, getChatPartner, chatController)
	app.get('/dashboard', logger, getMatches, generateStats, dashboardController)	
}