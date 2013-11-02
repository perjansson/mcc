app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/meeting', {
			templateUrl: 'app/partials/calculator.html',
			controller: 'MeetingCostCalculatorCtrl'
		}).
		when('/about', {
	        templateUrl: 'app/partials/about.html',
	        controller: 'AboutCtrl'
		}).
		otherwise({
			redirectTo: '/meeting'
		});
	}]);