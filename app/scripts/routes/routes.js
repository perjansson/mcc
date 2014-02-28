app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/meeting', {
			templateUrl: 'app/views/calculator.html',
			controller: 'MeetingCostCalculatorCtrl'
		}).
        when('/meeting/:meetingId', {
            templateUrl: 'app/views/meetingdetail.html',
            controller: 'MeetingDetailCtrl'
        }).
        when('/runningmeetings', {
            templateUrl: 'app/views/runningmeetings.html',
            controller: 'RunningMeetingsCtrl'
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