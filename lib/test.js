var X = function() {
	this.foo = 'bar'

	this.doff = function() {
		biff()
	}

	function biff() {
		console.log(this.foo);
	}
}

var x = new X
x.doff()