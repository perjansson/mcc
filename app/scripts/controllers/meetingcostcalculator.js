app.controller('MeetingCostCalculatorCtrl', function($scope, $http, $interval, $location, $window, constants, meetingCostService, meetingServiceSocketIO, meetingServiceREST) {

    /* Properties for handling updating of meeting cost text */
    var updateMeetingTextDelay = constants.meetingCostTextUpdateIntervalInMillis;
    var updateMeetingTextPromise;

    /* Properties for handling updating backend */
    var updateBackendDelay = constants.backendUpdateIntervalInMillis;
    var updateBackendPromise = 0;
    
    if (meetingCostService.hasMeeting()) {
        $scope.meeting = meetingCostService.getMeeting();
        if ($scope.meeting.status == 'started') {
            updateMeetingTextPromise = $interval(meetingCostCalculator, updateMeetingTextDelay);
            updateBackendPromise = $interval(sendMeetingToServer, updateBackendDelay);        
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
                meetingCost: null,
                goodMeeting: false
            };        
    }

    $http.get('app/currencies.json').success(function (data) {
        $scope.currencies = data;
    });
    
    if (constants.shouldPersistMeetings) {
        if (constants.shouldUseNodeJs) {
            var onConnectingCallback = function() {
                $('#connection-indicator').addClass('connecting').removeClass('connected').removeClass('disconnected');
            };
            var onConnectCallback = function() {
                $('#connection-indicator').addClass('connected').removeClass('disconnected').removeClass('connecting');
            };
            var onDisconnectCallback = function() {
                $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
            };
            var onErrorCallback = function() {
                $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
            };
            var onMeetingUpdatedCallback = function(meeting) {
                console.log('On meeting update: ' + JSON.stringify(meeting));
                $scope.meeting.id = meeting.id;
            };
            meetingServiceSocketIO.subscribe(onConnectingCallback, onConnectCallback, onDisconnectCallback, onErrorCallback, onMeetingUpdatedCallback);
        
            meetingServiceSocketIO.connect();
        }
    }

    $scope.startMeeting = function() {
        $scope.meeting.status = 'started';
        $scope.meeting.id = null;
        $scope.meeting.name = null;
        $scope.meeting.meetingStartTime = new Date();
        $scope.meeting.meetingCost = 0;
        $scope.meeting.meetingPauseTime = null;

        $interval.cancel(updateMeetingTextPromise);
        $interval.cancel(updateBackendPromise);
        updateMeetingTextPromise = $interval(meetingCostCalculator, updateMeetingTextDelay);
        updateBackendPromise = $interval(sendMeetingToServer, updateBackendDelay);

        sendMeetingToServer();
    };

    $scope.stopMeeting = function() {
        $scope.meeting.status = 'stopped';
        $scope.meeting.isBoring = false;

        pauseTimeStamp = new Date();
        $interval.cancel(updateMeetingTextPromise);
        $interval.cancel(updateBackendPromise);

        sendMeetingToServer();
    };

    $scope.pauseMeeting = function() {
        $scope.meeting.status = 'paused';

        $scope.meeting.pauseTimeStamp = new Date();
        $interval.cancel(updateMeetingTextPromise);
        $interval.cancel(updateBackendPromise);

        sendMeetingToServer();
    };

    $scope.resumeMeeting = function() {
        $scope.meeting.meetingPauseTime = $scope.meeting.meetingPauseTime + (new Date() - $scope.meeting.pauseTimeStamp);
        $scope.meeting.status = 'started';

        $scope.meeting.pauseTimeStamp = 0;
        updateMeetingTextPromise = $interval(meetingCostCalculator, updateMeetingTextDelay);
        updateBackendPromise = $interval(sendMeetingToServer, updateBackendDelay);

        sendMeetingToServer();
    };

    $scope.shareMeeting = function() {
        var meetingId = $scope.meeting.id;
        if (meetingId != null) {
            var path = constants.sharingUrl + meetingId;
            $location.path(path);
        }
    }

    $scope.addNameToMeeting = function() {
        sendMeetingToServer();
    }

    function meetingCostCalculator() {
        meetingCostService.calculateMeetingCost($scope.meeting);
    }

    function sendMeetingToServer() {
        if (constants.shouldPersistMeetings) {
            if (constants.shouldUseNodeJs) {
                meetingServiceSocketIO.send(JSON.stringify($scope.meeting));
            }
            if (constants.shouldUseSpringMvc) {
                meetingServiceREST.create($scope.meeting, function success(responseMeeting) {
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
        $interval.cancel(updateMeetingTextPromise);
        $interval.cancel(updateBackendPromise);
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