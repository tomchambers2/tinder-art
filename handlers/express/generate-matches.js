module.exports = function generateMatchesController(req, res) {
	if (req.generateErr) {
		return res.json({ err: req.generateErr })
	}
	return res.json(req.generateResults)
}