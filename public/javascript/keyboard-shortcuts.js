$(document).ready(function() {
	Mousetrap.bind('shift+d', function(e) {
		console.log("Debug toggled");
		$('.debug').toggleClass('hidden')
	})
})