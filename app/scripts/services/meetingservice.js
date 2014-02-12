app.factory('meetingService', function ($rootScope, constants) {

    var service = {};
    var socket;

    var meeting = null;
    var topList;

    service.getMeeting = function () {
        if (meeting == null) {
            meeting = {
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
                goodMeeting: false,
                duration: null,
                prettyDuration: null
            };
        }
        return meeting;
    }

    service.calculateMeetingCost = function (updatedMeeting) {
        meeting = updatedMeeting;
        meeting.meetingCost = roundToZeroDecimals(getCurrentMeetingCost());
    }

    function roundToZeroDecimals(value) {
        return Math.round(value).toFixed(0);
    }

    function getCurrentMeetingCost() {
        return getMeetingCostPerSecond() * getElapsedMeetingTimeInSeconds();
    }

    function getMeetingCostPerSecond() {
        var numberOfAttendees = meeting.numberOfAttendees;
        var averageHourlyRate = meeting.averageHourlyRate;
        return numberOfAttendees * (averageHourlyRate / 3600);
    }

    function getElapsedMeetingTimeInSeconds() {
        var meetingCurrentTime = new Date();
        return (meetingCurrentTime - meeting.meetingStartTime - meeting.meetingPauseTime) / 1000;
    }

    service.tryGetTopList = function () {
        if (topList != null) {
            return topList;
        } else {
            socket.emit('top list request');
            return null;
        }
    }

    service.send = function (data) {
        socket.emit('meeting update request', data);
    }

    service.connect = function () {
        // Only create connection if no connected socket exist
        if (socket == null || !socket.socket.connected) {

            socket = io.connect(constants.nodeJsBackendHost, {
                'force new connection': true
            });

            socket.on('connecting', function () {
                console.log('Trying to connect to websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket connecting event', topList);
            });

            socket.on('connect', function () {
                console.log('Connected to websocket at ' + constants.nodeJsBackendHost + ' d-(*_*)z');
                $rootScope.$emit('socket connect event', topList);
            });

            socket.on('reconnect', function () {
                console.log('Reconnected to websocket at ' + constants.nodeJsBackendHost + ' d-(*_*)z');
                $rootScope.$emit('socket connect event', topList);
            });

            socket.on('connect_failed', function () {
                console.log('Connect failed to websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket connect failed event', topList);
            });

            socket.on('reconnect_failed', function () {
                console.log('Reconnect failed to websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket connect failed event', topList);
            });

            socket.on('disconnect', function () {
                console.log('Disconnect from websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket disconnect event', topList);
            });

            socket.on('error', function (errorMessage) {
                console.log('Error ' + errorMessage + ' from websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket error event', topList);
            });

            socket.on('meeting update response', function (data) {
                console.log('meeting update response');
                meeting = data;
                $rootScope.$emit('meeting update event', meeting);
            });

            socket.on('meeting error', function (errorMessage) {
                console.log('Error ' + errorMessage + ' from websocket at ' + constants.nodeJsBackendHost);
            });

            socket.on('top list update response', function (data) {
                console.log('top list update response');
                topList = data;
                $rootScope.$emit('top list update event', topList);
            });
        }
    }

    service.connect();

    return service;

});