app.controller('TopListCtrl', function ($scope, $location, constants, meetingServiceSocketIO) {

    if (constants.shouldPersistMeetings) {
        if (constants.shouldUseNodeJs) {
            var onConnectingCallback = function () {
                $('#connection-indicator').addClass('connecting').removeClass('connected').removeClass('disconnected');
            };
            var onConnectCallback = function () {
                $('#connection-indicator').addClass('connected').removeClass('disconnected').removeClass('connecting');
            };
            var onDisconnectCallback = function () {
                $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
            };
            var onErrorCallback = function () {
                $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
            };
            var onTopListUpdatedCallback = function (toplist) {
                toplist.sort(function (a, b) {
                    return parseFloat(b.comparableMeetingCost) - parseFloat(a.comparableMeetingCost)
                });
                console.log('On toplist update');
                $scope.toplist = toplist;
                $scope.$apply();
            };

            meetingServiceSocketIO.subscribeTopList(onConnectingCallback, onConnectCallback, onDisconnectCallback, onErrorCallback, onTopListUpdatedCallback);
            meetingServiceSocketIO.connect();
            meetingServiceSocketIO.getTopList();
        }
    }

    $scope.orderByAttribute = 'cost';

    $scope.shareMeeting = function (meetingId) {
        console.log("Sharing " + meetingId);
        if (meetingId != null) {
            var path = constants.sharingUrl + meetingId;
            $location.path(path);
        }
    }

    $scope.getPrettyMeetingTime = function (meeting) {
        var prettyMeetingTime = null;
        var timeInHours = meeting.meetingCost / meeting.numberOfAttendees / meeting.averageHourlyRate;
        if (timeInHours >= 1) {
            var array = roundToDecimals(timeInHours, 2).toString().split('.');
            var hours = parseInt(array[0]);
            var minutes = parseInt(array[1]);
            prettyMeetingTime = hours + " h " + minutes + " min";
        } else if (timeInHours >= 0.01666666666667) {
            var minutes = timeInHours * 60;
            prettyMeetingTime = roundToDecimals(minutes, 0) + " min";
        } else {
            var seconds = timeInHours * 3600;
            prettyMeetingTime = roundToDecimals(seconds, 0) + " s";
        }
        return  prettyMeetingTime;
    }

    function roundToDecimals(value, numberOfDecimals) {
        return (Math.round(value * 100000) / 100000).toFixed(numberOfDecimals);
    }

});