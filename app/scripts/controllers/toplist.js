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

    $scope.orderByAttribute = 'comparableMeetingCost';
    $scope.orderByDesc = true;

    var nameOrderByDesc = true;
    var numberOfAttendeesOrderByDesc = true;
    var averageHourlyRateOrderByDesc = true;
    var meetingCostOrderByDesc = true;
    var durationOrderByDesc = true;
    var comparableMeetingCostOrderByDesc = true;

    $scope.updateNameOrder = function () {
        nameOrderByDesc = !nameOrderByDesc;
        updateOrder('name', nameOrderByDesc);
    }

    $scope.updateNumberOfAttendeesOrder = function () {
        numberOfAttendeesOrderByDesc = !numberOfAttendeesOrderByDesc;
        updateOrder('numberOfAttendees', numberOfAttendeesOrderByDesc);
    }

    $scope.updateAverageHourlyRateOrder = function () {
        averageHourlyRateOrderByDesc = !averageHourlyRateOrderByDesc;
        updateOrder('averageHourlyRate', averageHourlyRateOrderByDesc);
    }

    $scope.updateMeetingCostOrder = function () {
        meetingCostOrderByDesc = !meetingCostOrderByDesc;
        updateOrder('meetingCost', meetingCostOrderByDesc);
    }

    $scope.updateDurationOrder = function () {
        durationOrderByDesc = !durationOrderByDesc;
        updateOrder('duration', durationOrderByDesc);
    }

    $scope.updateComparableMeetingCostOrder = function () {
        comparableMeetingCostOrderByDesc = !comparableMeetingCostOrderByDesc;
        updateOrder('comparableMeetingCost', comparableMeetingCostOrderByDesc);
    }

    function updateOrder(column, orderByDesc) {
        $scope.orderByAttribute = column;
        $scope.orderByDesc = orderByDesc;
    }

    $scope.shareMeeting = function (meetingId) {
        console.log("Sharing " + meetingId);
        if (meetingId != null) {
            var path = constants.sharingUrl + meetingId;
            $location.path(path);
        }
    }

});
