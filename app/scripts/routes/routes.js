app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/meeting', {
			templateUrl: 'app/page/calculator.html'
		}).
		when('/about', {
	        templateUrl: 'app/page/about.html'
		}).
		otherwise({
			redirectTo: '/meeting'
		});
	}]);