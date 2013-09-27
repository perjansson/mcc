app.controller('MeetingCostController', function($scope, $location, constants) {

    var timerId = 0;
    var pauseTimeStamp = 0;
 	const intervalDelay = 50;
    
 	$scope.meeting = {
				    	numberOfAttendees: constants.numberOfAttendeesText, 
				    	averageHourlyRate: constants.averageHourlyRateText,
				    	currency: constants.currencyText,
                        status: 'notStarted',
                        isBoring: false,
                        meetingStartTime: null,
                        meetingPauseTime: null,
                        meetingCost: null
				    };

    var meetingCostCalculator = function() {
        $scope.meeting.meetingCost = roundToZeroDecimals(getCurrentMeetingCost());
        $scope.$apply();
    }

    function roundToZeroDecimals(value) {
        return Math.round(value).toFixed(0);
    }

    function getCurrentMeetingCost() {
        return getMeetingCostPerSecond() * getElapsedMeetingTimeInSeconds();
    }

    function getMeetingCostPerSecond() {
        var numberOfAttendees = $scope.meeting.numberOfAttendees;
        var averageHourlyRate = $scope.meeting.averageHourlyRate;
        return numberOfAttendees * (averageHourlyRate / 3600);
    }

    function getElapsedMeetingTimeInSeconds() {
        var meetingCurrentTime = new Date();
        return (meetingCurrentTime - $scope.meeting.meetingStartTime - $scope.meeting.meetingPauseTime) / 1000;    
    }

    $scope.startMeeting = function() {
        clearInterval(timerId);
        $scope.meeting.meetingStartTime = new Date();
        timerId = setInterval(meetingCostCalculator, intervalDelay);

        changeMeetingStatus('started');
        animateToBottom();
    };

    $scope.stopMeeting = function() {
        pauseTimeStamp = new Date();
        clearInterval(timerId);
        
        $scope.meeting.meetingStartTime = null;
        $scope.meeting.meetingPauseTime = null;

        $('#playground').hide();

        changeMeetingStatus('stopped');
        $scope.meetingIsNotBoring();
    };

    $scope.pauseMeeting = function() {
        pauseTimeStamp = new Date();
        clearInterval(timerId);
        changeMeetingStatus('paused');
    };

    $scope.resumeMeeting = function() {
        $scope.meeting.meetingPauseTime = $scope.meeting.meetingPauseTime + (new Date() - pauseTimeStamp);
        pauseTimeStamp = 0;
        timerId = setInterval(meetingCostCalculator, intervalDelay);
        changeMeetingStatus('started');
    };

    $scope.meetingIsBoring = function() {
        $scope.meeting.isBoring = true;
        $('#playground').show();
        animateToBottom();
    };

    $scope.meetingIsNotBoring = function() {
        $scope.meeting.isBoring = false;
        $('#playground').hide();
    };

    function changeMeetingStatus(status) {
        var meeting = $scope.meeting;
        meeting.status = status;
        console.log("Meeting " + status + ": " + JSON.stringify(meeting));
    }

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

    function animateToBottom() {
        $('html, body').scrollTop($('body').prop("scrollHeight"));
        return false;
    }

});