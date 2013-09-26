app.controller('MeetingCostController', function($scope, $location, constants) {
 	
 	$scope.meeting = {
				    	numberOfAttendees: constants.numberOfAttendeesText, 
				    	averageHourlyRate: constants.averageHourlyRateText,
				    	currency: constants.currencyText
				    };

    $scope.onNumberOfAttendeesFocus = function() {
    	if ($scope.meeting.numberOfAttendees == constants.numberOfAttendeesText) {
    		$scope.meeting.numberOfAttendees = '';    		
    	}
    };

    $scope.onNumberOfAttendeesBlur = function() {
    	if ($scope.meeting.numberOfAttendees == '') {
    		$scope.meeting.numberOfAttendees = constants.numberOfAttendeesText;    		
    	}
    };

    $scope.onAverageHourlyRateFocus = function() {
    	if ($scope.meeting.averageHourlyRate == constants.averageHourlyRateText) {
    		$scope.meeting.averageHourlyRate = '';    		
    	}
    };

    $scope.onAverageHourlyRateBlur = function() {
    	if ($scope.meeting.averageHourlyRate == '') {
    		$scope.meeting.averageHourlyRate = constants.averageHourlyRateText;    		
    	}
    };

    $scope.onCurrencyFocus = function() {
    	if ($scope.meeting.currency == constants.currencyText) {
    		$scope.meeting.currency = '';    		
    	}
    };

    $scope.onCurrencyBlur = function() {
    	if ($scope.meeting.currency == '') {
    		$scope.meeting.currency = constants.currencyText;    		
    	}
    };

});