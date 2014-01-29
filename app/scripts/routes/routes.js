app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/meeting', {
			templateUrl: 'app/views/calculator.html',
			controller: 'MeetingCostCalculatorCtrl'
		}).
        when('/meeting/:id', {
            templateUrl: 'app/views/meetingdetail.html',
            controller: 'MeetingDetailCtrl'
        }).
		when('/toplist', {
	        templateUrl: 'app/views/toplist.html',
	        controller: 'TopListCtrl'
		}).
		when('/about', {
	        templateUrl: 'app/views/about.html',
	        controller: 'AboutCtrl'
		}).
		otherwise({
			redirectTo: '/meeting'
		});
	}]);