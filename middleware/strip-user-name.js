module.exports = function chatController(req, res, next) {
	console.log("MESSAGES",req.partner.messages)

	req.partner.messages = req.partner.messages.map(function(messageObj) {
		console.log('Prefiltered message:',messageObj.message)
		var filteredMessage = messageObj.message.replace(/jenna/i, "")
		console.log('Filtered message:',filteredMessage)
		messageObj.message = filteredMessage
		return messageObj
	})	
	next()
}	