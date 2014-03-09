app.factory('meetingService', function ($rootScope, constants) {

    var service = {};
    var socket;

    var activeMeeting = null;
    var topList;
    var runningMeetings;

    service.getActiveMeeting = function () {
        if (activeMeeting == null) {
            activeMeeting = aMeeting();
        }
        return activeMeeting;
    }

    service.tryToGetTopList = function () {
        if (topList != null) {
            return topList;
        } else {
            socket.emit('top list request');
            return null;
        }
    }

    service.tryToGetRunningMeetings = function () {
        if (runningMeetings != null) {
            return runningMeetings;
        } else {
            socket.emit('running meetings request');
            return null;
        }
    }

    service.tryToGetMeetingById = function (meetingId) {
        socket.emit('meeting status request', meetingId);
    }

    service.deleteMeetingWithId = function (meetingId) {
        socket.emit('meeting delete request', meetingId);
    }

    service.send = function (meeting) {
        socket.emit('meeting update request', meeting);
    }

    service.connect = function () {
        // Only create connection if no connected socket exist
        if (socket == null || !socket.socket.connected) {

            socket = io.connect(constants.nodeJsBackendHost, {
                'force new connection': true
            });

            socket.on('connecting', function () {
                console.log('Trying to connect to websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket connecting event');
            });

            socket.on('connect', function () {
                console.log('Connected to websocket at ' + constants.nodeJsBackendHost + ' d-(*_*)z');
                $rootScope.$emit('socket connect event');
            });

            socket.on('reconnect', function () {
                console.log('Reconnected to websocket at ' + constants.nodeJsBackendHost + ' d-(*_*)z');
                $rootScope.$emit('socket connect event');
            });

            socket.on('connect_failed', function () {
                console.log('Connect failed to websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket connect failed event');
            });

            socket.on('reconnect_failed', function () {
                console.log('Reconnect failed to websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket connect failed event');
            });

            socket.on('disconnect', function () {
                console.log('Disconnect from websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket disconnect event');
            });

            socket.on('error', function (errorMessage) {
                console.log('Error ' + errorMessage + ' from websocket at ' + constants.nodeJsBackendHost);
                $rootScope.$emit('socket error event');
            });

            socket.on('meeting update response', function (meeting) {
                console.log('meeting update response');
                activeMeeting.id = meeting.id;
                activeMeeting.lastUpdatedAtTimeStamp = meeting.lastUpdatedAtTimeStamp;
                activeMeeting.comparableCurrency = meeting.comparableCurrency;
                activeMeeting.comparableMeetingCost = meeting.comparableMeetingCost;
                activeMeeting.duration = meeting.duration;
                activeMeeting.prettyDuration = meeting.prettyDuration;
                $rootScope.$emit('meeting update event', activeMeeting);
            });

            socket.on('some meeting update response', function (meeting) {
                console.log('some meeting update response');
                $rootScope.$emit('some meeting update event', meeting);
            });

            socket.on('meeting status response', function (meeting) {
                console.log('meeting status response');
                $rootScope.$emit('meeting status event', meeting);
            });

            socket.on('meeting delete response', function (meeting) {
                console.log('meeting delete response');
                $rootScope.$emit('meeting delete event', meeting);
            });

            socket.on('meeting error', function (errorMessage) {
                console.log('Error ' + errorMessage + ' from websocket at ' + constants.nodeJsBackendHost);
            });

            socket.on('top list update response', function (data) {
                console.log('top list update response');
                topList = data;
                $rootScope.$emit('top list update event', topList);
            });

            socket.on('running meetings update response', function (data) {
                console.log('running meetings update response');
                runningMeetings = data;
                $rootScope.$emit('running meetings update event', runningMeetings);
            });
        }
    }

    service.connect();

    return service;

});