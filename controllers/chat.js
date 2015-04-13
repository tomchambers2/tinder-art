module.exports = function chatController(req, res) {
	res.render('chat', { partner: req.partner })
}	