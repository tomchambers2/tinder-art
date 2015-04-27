var chatHandler = require('./handlers/express/chat')
var testChatHandler = require('./handlers/express/test-chat')
var dashboardHandler = require('./handlers/express/dashboard')
var generateMatchesHandler = require('./handlers/express/generate-matches')
var loginHandler = require('./handlers/express/login')
var killUserHandler = require('./handlers/express/kill-user')
var facebookAuthHandler = require('./handlers/express/facebook-auth')

var logger = require('./middleware/logger')

var getMatches = require('./middleware/get-matches')
var getBlocks = require('./middleware/get-blocks')
var getChatPartner = require('./middleware/get-chat-partner')
var generateStats = require('./middleware/generate-stats')
var generateMatches = require('./middleware/generate-matches')
var dirtyFacebookAuth = require('./middleware/dirty-facebook-auth')
var killUser = require('./middleware/kill-user')

module.exports = function(app) {
	app.get('/dashboard', logger, dirtyFacebookAuth, getMatches, getBlocks, generateStats, dashboardHandler)	

	app.get('/login', logger, loginHandler)

	app.get('/facebook-auth', logger, facebookAuthHandler)

	app.get('/api/generate-matches', logger, dirtyFacebookAuth, generateMatches, generateMatchesHandler)

	app.get('/api/kill-user/:userId', logger, dirtyFacebookAuth, killUser, killUserHandler)

	app.get('/test-chat', logger, dirtyFacebookAuth, getChatPartner, testChatHandler)

	app.get('/data-input', function(req, res) {
		return res.render('data-input')
	})

	app.get('/', logger, dirtyFacebookAuth, getChatPartner, chatHandler)

}