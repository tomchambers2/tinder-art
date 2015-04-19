function addMatch(match) {
	var matched = moment(match.created_date).fromNow()
	var lastActivity = moment(match.last_activity_date).fromNow()
	var truncatedMatchId = match._id.substring(0, 4)+'...'
	var row = '<tr><td>'+truncatedMatchId+'</td><td>Unknown</td><td>'+matched+'</td><td>'+lastActivity+'</td><td><i>Just matched, no messages</i></td><td></td><td></td>'
	$('.header-row').after(row)
}

$(document).ready(function() {
	$('.remove-user').click(function(e) {
		var remove = this
		$(this).button('loading') 
		console.log('did click on user');
		var userId = $(this).data('user-id')
		$.get('/api/kill-user/'+userId, function(data) {
			$(remove).button('reset')

			console.log('returned from remove',data);
			if (data.success) {
				$('*[data-user-id="'+userId+'"] .status').addClass('dead')
			}
			$(remove).hide()
		})
	})


	$('.generate-matches').click(function(e) {
		$(this).button('loading')
		$('.generate-result').html('')
		$.get('/api/generate-matches', function(data) {
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