module.exports = function(req, res, next) {
	console.info("Request for",req.path)
	next()
}