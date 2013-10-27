app.controller('MeetingCostController', function($scope, $location, constants, socketioMeetingService, restMeetingService) {

    var updateMeetingTextTimerId = 0;
    var updateBackendTimerId = 0;
    var pauseTimeStamp = 0;
 	var updateMeetingTextIntervalDelay = constants.meetingCostTextUpdateIntervalInMillis;
    var backendUpdateIntervalDelay = constants.backendUpdateIntervalInMillis;
    var socket;
    
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
            connectUsingNodeJs();
        }
    }

    function connectUsingNodeJs() {
        var onConnectionCallback = function(data) {
            console.log('On connection: ' + data);
        };
        var onMessageCallback = function(data) {
            console.log('On message: ' + JSON.stringify(data, null, 4));
            $scope.meeting.id = data.id;
        };
        socketioMeetingService.subscribe(onConnectionCallback, onMessageCallback);
        socketioMeetingService.connect();
    }

    $scope.meetingIsInvalid = function() {
        var m = $scope.meeting;
        return m.numberOfAttendees == null || m.averageHourlyRate == null || m.currency == null || m.currency == "";
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
                socketioMeetingService.send(JSON.stringify($scope.meeting));
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
        $scope.meeting.status = 'started';
        $scope.meeting.id = null;
        $scope.meeting.meetingStartTime = new Date();
        $scope.meeting.meetingCost = 0;
        $scope.meeting.meetingPauseTime = null;

        clearInterval(updateMeetingTextTimerId);
        clearInterval(updateBackendTimerId);
        updateMeetingTextTimerId = setInterval(meetingCostCalculator, updateMeetingTextIntervalDelay);
        updateBackendTimerId = setInterval(sendMeetingToServer, backendUpdateIntervalDelay);

        sendMeetingToServer();

        animateToBottom();
    };

    $scope.stopMeeting = function() {
        $scope.meeting.status = 'stopped';
        $scope.meeting.isBoring = false;

        pauseTimeStamp = new Date();
        clearInterval(updateMeetingTextTimerId);
        clearInterval(updateBackendTimerId);

        sendMeetingToServer();

    };

    $scope.pauseMeeting = function() {
        $scope.meeting.status = 'paused';

        pauseTimeStamp = new Date();
        clearInterval(updateMeetingTextTimerId);
        clearInterval(updateBackendTimerId);

        sendMeetingToServer();
    };

    $scope.resumeMeeting = function() {
        $scope.meeting.meetingPauseTime = $scope.meeting.meetingPauseTime + (new Date() - pauseTimeStamp);
        $scope.meeting.status = 'started';

        pauseTimeStamp = 0;
        updateMeetingTextTimerId = setInterval(meetingCostCalculator, updateMeetingTextIntervalDelay);
        updateBackendTimerId = setInterval(sendMeetingToServer, backendUpdateIntervalDelay);

        sendMeetingToServer();
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

    function animateToBottom() {
        $('html, body').scrollTop($('body').prop("scrollHeight"));
        return false;
    }

});