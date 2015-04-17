var chatController = require('./controllers/chat')
var dashboardController = require('./controllers/dashboard')
var generateMatchesController = require('./controllers/generate-matches')
var loginController = require('./controllers/login')

var logger = require('./middleware/logger')

var getMatches = require('./middleware/get-matches')
var getBlocks = require('./middleware/get-blocks')
var getChatPartner = require('./middleware/get-chat-partner')
var generateStats = require('./middleware/generate-stats')
var generateMatches = require('./middleware/generate-matches')
var facebookAuth = require('./middleware/facebook-auth')

module.exports = function(app) {
	app.get('/chat', logger, facebookAuth, getChatPartner, chatController)
	app.get('/dashboard', logger, facebookAuth, getMatches, getBlocks, generateStats, dashboardController)	

	app.get('/login', logger, loginController)

	app.get('/generate-matches', logger, facebookAuth, generateMatches, generateMatchesController)

}