var chatController = require('./controllers/chat')
var dashboardController = require('./controllers/dashboard')
var generateMatchesController = require('./controllers/generate-matches')
var loginController = require('./controllers/login')
var killUserController = require('./controllers/kill-user')
var facebookAuthController = require('./controllers/facebook-auth')

var logger = require('./middleware/logger')

var getMatches = require('./middleware/get-matches')
var getBlocks = require('./middleware/get-blocks')
var getChatPartner = require('./middleware/get-chat-partner')
var generateStats = require('./middleware/generate-stats')
var generateMatches = require('./middleware/generate-matches')
var dirtyFacebookAuth = require('./middleware/dirty-facebook-auth')
var killUser = require('./middleware/kill-user')

module.exports = function(app) {
	app.get('/chat', logger, dirtyFacebookAuth, getChatPartner, chatController)

	app.get('/dashboard', logger, dirtyFacebookAuth, getMatches, getBlocks, generateStats, dashboardController)	

	app.get('/login', logger, loginController)

	app.get('/facebook-auth', logger, facebookAuthController)

	app.get('/api/generate-matches', logger, dirtyFacebookAuth, generateMatches, generateMatchesController)

	app.get('/api/kill-user/:userId', logger, dirtyFacebookAuth, killUser, killUserController)
}