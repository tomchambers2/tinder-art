module.exports = function generateMatchesController(req, res) {
	if (req.generateErr) {
		return res.json({ err: req.generateErr })
	}
	console.log('Matches generated data:',req.generateResults)
	return res.json(req.generateResults)
}