app.controller('TopListCtrl', function ($rootScope, $scope, $location, constants, meetingService) {

    var deRegTopListUpdateEvent = $rootScope.$on('top list update event', function (event, topList) {
        sortAndSaveTopList(topList);
        $scope.$apply();
    });

    function sortAndSaveTopList(topList) {
        topList.sort(function (a, b) {
            return parseFloat(b.comparableMeetingCost) - parseFloat(a.comparableMeetingCost)
        });
        $scope.topList = topList;
        calculateTotals(topList);
    }

    function calculateTotals(topList) {
        var totalCost = null;
        var totalNumberOfAttendees = null;
        var totalTimeInHours = null;
        topList.forEach(function (meeting) {
            totalCost = totalCost + parseFloat(meeting.comparableMeetingCost);
            totalNumberOfAttendees = totalNumberOfAttendees + parseInt(meeting.numberOfAttendees);
            totalTimeInHours = totalTimeInHours + (meeting.meetingCost / meeting.numberOfAttendees / meeting.averageHourlyRate);
        });
        $scope.totalComparableMeetingCost = totalCost + ' ' + constants.currencyText;
        $scope.totalNumberOfAttendees = totalNumberOfAttendees;
        $scope.totalPrettyMeetingDuration = timeInHoursToPrettyMeetingDuration(totalTimeInHours);
    }

    const decimalToTimeFactor = 0.6;

    function timeInHoursToPrettyMeetingDuration(timeInHours) {
        var prettyMeetingDuration = null;
        var hours, minutes, seconds = null;
        if (timeInHours >= 1) {
            var array = roundToDecimals(timeInHours, 2).toString().split('.');
            hours = parseInt(array[0]);
            minutes = roundToDecimals(parseInt(array[1]) * decimalToTimeFactor, 0);
            prettyMeetingDuration = hours + " h " + minutes + " min";
        } else if (timeInHours >= 0.01666666666667) {
            minutes = timeInHours * 60;
            prettyMeetingDuration = roundToDecimals(minutes, 0) + " min";
        } else {
            seconds = timeInHours * 3600;
            prettyMeetingDuration = roundToDecimals(seconds, 0) + " s";
        }
        return prettyMeetingDuration;
    }

    function roundToDecimals(value, numberOfDecimals) {
        return (Math.round(value * 100000) / 100000).toFixed(numberOfDecimals);
    }

    var topList = meetingService.tryToGetTopList();
    if (topList != null) {
        sortAndSaveTopList(topList);
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
        if (meetingId != null) {
            var path = constants.meetingDetailUrl + meetingId;
            $location.path(path);
        }
    }

    $scope.$on('$destroy', function () {
        deRegTopListUpdateEvent()
    });

});
