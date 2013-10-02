app.controller('MeetingCostController', function($scope, $location, constants, nodeJsMeetingService, restMeetingService) {

    var timerId = 0;
    var pauseTimeStamp = 0;
 	var intervalDelay = constants.meetingCostUpdateIntervalInMillis;
    
 	$scope.meeting = {
				    	id: null,
                        name: null,
                        numberOfAttendees: constants.numberOfAttendeesText, 
				    	averageHourlyRate: constants.averageHourlyRateText,
				    	currency: constants.currencyText,
                        status: 'notStarted',
                        isBoring: false,
                        meetingStartTime: null,
                        meetingPauseTime: null,
                        meetingCost: 0
				    };

    $scope.messages = [];
 
    if (constants.shouldPersistMeetings) {
        if (constants.shouldUseNodeJs) {
            nodeJsMeetingService.subscribe(function(message) {
                console.log(message);
            });

            nodeJsMeetingService.connect();
        }
    }

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

    function sendMeetingToServer() {
        if (constants.shouldPersistMeetings) {
            if (constants.shouldUseNodeJs) {
                nodeJsMeetingService.send(JSON.stringify($scope.meeting));
            }
            if (constants.shouldUseSpringMvc) {
                restMeetingService.create($scope.meeting, function success(responseMeeting) {
                    // Update meeting with id from response
                    $scope.meeting.id = responseMeeting.id;
                    console.log(JSON.stringify($scope.meeting));
                });
            }
        }
    }

    $scope.startMeeting = function() {
        $scope.meeting.id = null;
        $scope.meeting.meetingStartTime = new Date();
        $scope.meeting.meetingCost = 0;
        $scope.meeting.meetingPauseTime = null;

        clearInterval(timerId);
        timerId = setInterval(meetingCostCalculator, intervalDelay);

        changeMeetingStatus('started');

        sendMeetingToServer();

        animateToBottom();
    };

    $scope.stopMeeting = function() {
        pauseTimeStamp = new Date();
        clearInterval(timerId);

        changeMeetingStatus('stopped');

        sendMeetingToServer();

        $('#playground').hide();
        $scope.meetingIsNotBoring();
    };

    $scope.pauseMeeting = function() {
        pauseTimeStamp = new Date();
        clearInterval(timerId);
        changeMeetingStatus('paused');

        sendMeetingToServer();
    };

    $scope.resumeMeeting = function() {
        $scope.meeting.meetingPauseTime = $scope.meeting.meetingPauseTime + (new Date() - pauseTimeStamp);
        pauseTimeStamp = 0;
        timerId = setInterval(meetingCostCalculator, intervalDelay);
        changeMeetingStatus('started');

        sendMeetingToServer();
    };

    $scope.meetingIsBoring = function() {
        $scope.meeting.isBoring = true;
        $('#playground').show();
        animateToBottom();
    };

    $scope.meetingIsNotBoring = function() {
        $scope.meeting.isBoring = false;
        $('#playground').hide();
        animateToTop();
    };

    function changeMeetingStatus(status) {
        var meeting = $scope.meeting;
        meeting.status = status;
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

    function animateToTop() {
        $('html, body').scrollTop(0);
        return false;
    }

    function animateToBottom() {
        $('html, body').scrollTop($('body').prop("scrollHeight"));
        return false;
    }

});