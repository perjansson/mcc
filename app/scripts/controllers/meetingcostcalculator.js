app.controller('MeetingCostCalculatorCtrl', function($scope, $location, $window, constants, meetingCostService, socketioMeetingService, restMeetingService) {

    /* Properties for handling updating of meeting cost text */
    var updateMeetingTextIntervalDelay = constants.meetingCostTextUpdateIntervalInMillis;
    var updateMeetingTextTimerId = 0;

    /* Properties for handling updating backend */
    var updateBackendIntervalDelay = constants.backendUpdateIntervalInMillis;
    var updateBackendTimerId = 0;

    $scope.version = constants.versionNumber;
    
    if (meetingCostService.hasMeeting()) {
        $scope.meeting = meetingCostService.getMeeting();
        if ($scope.meeting.status == 'started') {
            updateMeetingTextTimerId = setInterval(meetingCostCalculator, updateMeetingTextIntervalDelay);
            updateBackendTimerId = setInterval(sendMeetingToServer, updateBackendIntervalDelay);        
        }
    } else  {
        $scope.meeting = 
            {
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
    }
    
    if (constants.shouldPersistMeetings) {
        if (constants.shouldUseNodeJs) {
            var onConnectCallback = function() {
                $('#connection-indicator').addClass('connected').removeClass('disconnected');
            };
            var onMeetingUpdatedCallback = function(meeting) {
                console.log('On meeting update: ' + JSON.stringify(meeting));
                $scope.meeting.id = meeting.id;
            };
            var onDisconnectCallback = function() {
                $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
            };
            var onErrorCallback = function() {
                $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
            };
            socketioMeetingService.subscribe(onConnectCallback, onMeetingUpdatedCallback, onDisconnectCallback, onErrorCallback);
        
            socketioMeetingService.connect();
        }
    }

    $scope.connect = function() {        
        if (constants.shouldPersistMeetings && constants.shouldUseNodeJs && $('#connection-indicator').attr('class').split(' ') == 'disconnected') {
            socketioMeetingService.connect();
        }
    }

    $scope.startMeeting = function() {
        $scope.meeting.status = 'started';
        $scope.meeting.id = null;
        $scope.meeting.name = null;
        $scope.meeting.meetingStartTime = new Date();
        $scope.meeting.meetingCost = 0;
        $scope.meeting.meetingPauseTime = null;

        clearInterval(updateMeetingTextTimerId);
        clearInterval(updateBackendTimerId);
        updateMeetingTextTimerId = setInterval(meetingCostCalculator, updateMeetingTextIntervalDelay);
        updateBackendTimerId = setInterval(sendMeetingToServer, updateBackendIntervalDelay);

        sendMeetingToServer();
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

    $scope.shareMeeting = function() {
        var meetingId = $scope.meeting.id;
        if (meetingId != null) {
            $window.open(constants.sharingUrl + meetingId);  
        }
    }

    $scope.addNameToMeeting = function() {
        sendMeetingToServer();
    }

    function meetingCostCalculator() {
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

    $scope.animateToBottom = function() {
        setTimeout(function () {    
            $('html, body').scrollTop($('body').prop("scrollHeight"));
        }, 100);
    }

    $scope.$on('$destroy', function controllerDestroyed() {
        clearInterval(updateMeetingTextTimerId);
        clearInterval(updateBackendTimerId);
    })

    /**********************************************
    ******************* TIC TAC TOE ***************
    **********************************************/
    $scope.cellStyle= {
        'min-height': '100%',
        'border': '2px solid #C4C4C4',
        'text-align': 'center',
        'vertical-align': 'middle',
        'cursor': 'pointer',
        'font-size': '4em',
        'color': '#C4C4C4'
    };

    $scope.reset = function() {
        $scope.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        $scope.nextMove = 'X';
        $scope.winner = '';
    };

    $scope.dropPiece = function(row, col) {
        if (!$scope.winner && !$scope.board[row][col]) {
            $scope.board[row][col] = $scope.nextMove;
            $scope.nextMove = $scope.nextMove == 'X' ? 'O' : 'X';
        }
        grade();
    };

    $scope.reset();

    function grade() {
        var b = $scope.board;
        $scope.winner =
            row(0) || row(1) || row(2) ||
            col(0) || col(1) || col(2) ||
            diagonal(-1) || diagonal(1);
        function row(row) { return same(b[row][0], b[row][1], b[row][2]);}
        function col(col) { return same(b[0][col], b[1][col], b[2][col]);}
        function diagonal(i) { return same(b[0][1-i], b[1][1], b[2][1+i]);}
        function same(a, b, c) { return (a==b && b==c) ? a : '';};
    }

    function readUrl(value) {
        if (value) {
            value = value.split('/');
            $scope.nextMove = value[1];
            angular.forEach(value[0].split(';'), function(row, col){
                $scope.board[col] = row.split(',');
            });
            grade();
        }
    }

});