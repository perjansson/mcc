app.filter('tictactoewinner', function() {
	return function(winner) {
		return "Player " + winner + " has won! :)";
	}
});