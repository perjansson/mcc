app.controller('MeetingCostController', function($scope, $location, constants, meetingCostService, socketioMeetingService, restMeetingService) {

    /* Properties for handling updating of meeting cost text */
    var updateMeetingTextIntervalDelay = constants.meetingCostTextUpdateIntervalInMillis;
    var updateMeetingTextTimerId = 0;

    /* Properties for handling updating backend */
    var updateBackendIntervalDelay = constants.backendUpdateIntervalInMillis;
    var updateBackendTimerId = 0;
    
 	$scope.meeting = {
				    	id: null,
                        name: null,
                        numberOfAttendees: constants.numberOfAttendeesText, 
				    	averageHourlyRate: constants.averageHourlyRateText,
				    	currency: constants.currencyText,
                        status: 'notStarted',
                        isBoring: false,
                        meetingStartTime: null,
                        pauseTimeStamp: null,
                        meetingPauseTime: null,
                        meetingCost: null
				    };
 
    if (constants.shouldPersistMeetings) {
        if (constants.shouldUseNodeJs) {
            connectUsingNodeJs();
        }
    }

    function connectUsingNodeJs() {
        var onConnectCallback = function() {
            console.log('Websocket connection accepted to Node.js backend on ' + constants.nodeJsBackendHost + '  d-(*_*)z');
            $('#connection-indicator').addClass('connected').removeClass('disconnected');
        };
        var onMessageCallback = function(data) {
            console.log('On message: ' + JSON.stringify(data, null, 4));
            $scope.meeting.id = data.id;
        };
        var onDisconnectCallback = function() {
            console.log('Websocket connection disconnected o_O');
            $('#connection-indicator').addClass('disconnected').removeClass('connected');
        };
        var onErrorCallback = function() {
            console.log('Websocket error >:(');
            $('#connection-indicator').addClass('disconnected').removeClass('connected');
        };
        socketioMeetingService.subscribe(onConnectCallback, onMessageCallback, onDisconnectCallback, onErrorCallback);
        socketioMeetingService.connect();
    }

    $scope.connect = function() {        
        if (constants.shouldUseNodeJs && $('#connection-indicator').attr('class').split(' ') == 'disconnected') {
            connectUsingNodeJs();
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
        updateBackendTimerId = setInterval(sendMeetingToServer, updateBackendIntervalDelay);

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

        $scope.meeting.pauseTimeStamp = new Date();
        clearInterval(updateMeetingTextTimerId);
        clearInterval(updateBackendTimerId);

        sendMeetingToServer();
    };

    $scope.resumeMeeting = function() {
        $scope.meeting.meetingPauseTime = $scope.meeting.meetingPauseTime + (new Date() - $scope.meeting.pauseTimeStamp);
        $scope.meeting.status = 'started';

        $scope.meeting.pauseTimeStamp = 0;
        updateMeetingTextTimerId = setInterval(meetingCostCalculator, updateMeetingTextIntervalDelay);
        updateBackendTimerId = setInterval(sendMeetingToServer, updateBackendIntervalDelay);

        sendMeetingToServer();
    };

    var meetingCostCalculator = function() {
        $scope.meeting.meetingCost = meetingCostService.getMeetingCost($scope.meeting);
        $scope.$apply();
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

    function animateToBottom() {
        $('html, body').scrollTop($('body').prop("scrollHeight"));
        return false;
    }

});