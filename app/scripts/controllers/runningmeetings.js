app.controller('RunningMeetingsCtrl', function ($rootScope, $scope, $location, constants, meetingService) {

    var deRegRunningMeetingsUpdateEvent = $rootScope.$on('running meetings update event', function (event, runningMeetings) {
        sortAndSaveRunningMeetings(runningMeetings);
        $scope.$apply();
    });

    function sortAndSaveRunningMeetings(runningMeetings) {
        runningMeetings.sort(function (a, b) {
            return parseFloat(b.comparableMeetingCost) - parseFloat(a.comparableMeetingCost)
        });
        $scope.runningMeetings = runningMeetings;
        calculateTotals(runningMeetings);
    }

    function calculateTotals(runningMeetings) {
        var totalCost = null;
        var totalNumberOfAttendees = null;
        var totalTimeInHours = null;
        runningMeetings.forEach(function (meeting) {
            totalCost = totalCost + parseFloat(meeting.comparableMeetingCost);
            totalNumberOfAttendees = totalNumberOfAttendees + parseInt(meeting.numberOfAttendees);
            totalTimeInHours = totalTimeInHours + (meeting.meetingCost / meeting.numberOfAttendees / meeting.averageHourlyRate);
        });
        $scope.totalComparableMeetingCost = roundToDecimals(totalCost, 5) + ' ' + constants.currencyText;
        $scope.totalNumberOfAttendees = totalNumberOfAttendees;
        $scope.totalPrettyMeetingDuration = timeInHoursToPrettyMeetingDuration(totalTimeInHours);
    }

    var decimalToTimeFactor = 0.6;

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

    var runningMeetings = meetingService.tryToGetRunningMeetings();
    if (runningMeetings != null) {
        sortAndSaveRunningMeetings(runningMeetings);
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
        deRegRunningMeetingsUpdateEvent()
    });

});
