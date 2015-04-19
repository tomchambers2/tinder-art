function addMatch(match) {
	var matched = moment(match.created_date).fromNow()
	var lastActivity = moment(match.last_activity_date).fromNow()
	var row = '<tr><td>'+match._id+'</td><td>Unknown</td><td>'+matched+'</td><td>'+lastActivity+'</td><td><i>Just matched, no messages</i></td><td></td><td></td>'
	$('.match-table').prepend(row)
}

$(document).ready(function() {

	$('.generate-matches').click(function(e) {
		$(this).button('loading')
		$('.generate-result').html('')
		$.get('/generate-matches', function(data) {
			$('.generate-matches').button('reset')

			if (data.err) {
				console.log("Error found")
				$('.generate-result').html('<p style="color:red">'+data.err+'</p>')
				return
			}

			console.log(data);
			console.log(JSON.stringify(data));
			var stats = data.stats

			var statsTable = '<table>'
			statsTable += '<tr><td>Total attempts:</td><td>'+stats.attempts+'</td></tr>'
			statsTable += '<tr><td>Total likes:</td><td>'+stats.likes+'</td></tr>'
			statsTable += '<tr><td>Failed likes:</td><td>'+stats.fails+'</td></tr>'
			statsTable += '<tr><td>New matches:</td><td>'+stats.matches+'</td></tr>'
			statsTable += '<tr><td>Time taken:</td><td>'+stats.totalTime / 1000+' seconds</td></tr>'
			statsTable += '</table>'
			$('.generate-result').html(statsTable)

			data.matches.forEach(function(match) {
				addMatch(match)
			})
		})
	})
})