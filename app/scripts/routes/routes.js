app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/meeting', {
			templateUrl: 'app/page/calculator.html',
			controller: 'MeetingCostCalculatorCtrl'
		}).
		when('/about', {
	        templateUrl: 'app/page/about.html'
		}).
		otherwise({
			redirectTo: '/meeting'
		});
	}]);