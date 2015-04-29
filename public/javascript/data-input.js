$(document).ready(function() {
	var ref = new Firebase('https://tinder-art.firebaseio.com')
	var trainingData = ref.child('trainingData')
	var phrases = ref.child('phrases')
	//a save function

	var categories = ['hello','sexy','etc']

	function loadCategories() {
		$.each(categories, function(index, category) {
		    $('.phrase-category').append(
		        $('<option></option>').val(category).html(category)
		    )
		    $('.reply-category').append(
		        $('<option></option>').val(category).html(category)
		    )		    
		})
	}

	loadCategories()

	$('.add-phrase').click(function(e) {
		e.preventDefault()

		console.log('adding phrase')

		if (!$('.phrase').val()) {
			console.log('emtpy, not adding');
			return;
		}

		trainingData.push({
			phrase: $('.phrase').val(),
			category: $('phrase-category').find(':selected').text()
		})
	})

	$('.add-reply').click(function(e) {
		e.preventDefault()

		console.log('adding reply')

		var reply

		var category = $('.reply-category').find(':selected').text()

		var replyPrincess = $('.reply-princess')
		if (replyPrincess) {
			phrases.child('princess').child('category').push(reply)
		}

		var replyFeminist = $('.reply-feminist')
		if (replyFeminist) {
			phrases.child('princess').child('category').push(reply)
		}

		var replySexy = $('.reply-sexy')
		if (replySexy) {
			phrases.child('sexy').child('category').push(reply)
		}

		toastr.success('New replies added')
	})
})